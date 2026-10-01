"""Photo -> manga print panels.

    python scripts/manga-art/manga.py scripts/manga-art/portrait.json

A manga page is built in layers, and so is this:

  主線   pen lines   — Difference-of-Gaussians edge response, inked on the
                       dark side of each edge so strokes taper naturally
  ベタ   solid black — the darkest regions, filled flat
  白抜き white cuts  — thin bright ridges cut back into the blacks (folds,
                       hair shine), the way an inker scratches highlights
  網トーン screentone — midtones as a 45° dot grid, stepped like real
                       pre-printed tone sheets (10%, 20%, ...)
  集中線 focus lines — radial lines in the background, behind the subject

Analyse once, render per size: every map above is computed once at the
photo's native resolution as a smooth float field, then each output crop is
scaled up and inked *at its final pixel size*. Lines stay crisp like vector
art, and every width of one panel gets the same number of dots across —
so a browser picking the 960px or the 2048px file sees the same picture,
and never has to shrink a dot pattern (which is what causes moiré).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

INK = np.array([0x14, 0x11, 0x0F], np.float32)    # --ink   #14110f (RGB)
PAPER = np.array([0xF4, 0xF1, 0xE9], np.float32)  # --paper #f4f1e9 (RGB)
ANALYSIS_WIDTH = 900                              # thresholds below are tuned at this size

LABELS = {"bg": cv2.GC_BGD, "fg": cv2.GC_FGD, "pr_bg": cv2.GC_PR_BGD, "pr_fg": cv2.GC_PR_FGD}


# ---------------------------------------------------------------- analysis --
def smoothstep(e0: float, e1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def dog(g: np.ndarray, sigma: float, k: float = 1.6) -> np.ndarray:
    """Difference of Gaussians: negative on the dark side of an edge."""
    return cv2.GaussianBlur(g, (0, 0), sigma) - cv2.GaussianBlur(g, (0, 0), sigma * k)


def subject_mask(img: np.ndarray, seeds: list[dict]) -> np.ndarray:
    """GrabCut, seeded by hand — the same rough mask a designer would paint."""
    h, w = img.shape[:2]
    mask = np.full((h, w), cv2.GC_PR_BGD, np.uint8)
    for s in seeds:  # later seeds override earlier ones
        label = LABELS[s["label"]]
        if "rect" in s:
            x0, y0, x1, y1 = s["rect"]
            mask[y0:y1, x0:x1] = label
        elif "ellipse" in s:
            cx, cy, rx, ry = s["ellipse"]
            cv2.ellipse(mask, (cx, cy), (rx, ry), 0, 0, 360, int(label), -1)
        elif "poly" in s:
            cv2.fillPoly(mask, [np.array(s["poly"], np.int32)], int(label))
    bgd, fgd = np.zeros((1, 65)), np.zeros((1, 65))
    cv2.grabCut(img, mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    sub = np.isin(mask, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)
    sub = cv2.morphologyEx(sub, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
    sub = cv2.morphologyEx(sub, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    # Smooth the cut edge so the outline doesn't inherit GrabCut's stair-steps.
    return cv2.GaussianBlur(sub.astype(np.float32), (0, 0), 4)


def analyse(cfg: dict) -> dict[str, np.ndarray]:
    img = cv2.imread(cfg["source"])
    if img is None:
        sys.exit(f"cannot read {cfg['source']}")
    scale = ANALYSIS_WIDTH / img.shape[1]
    img = cv2.resize(img, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    h, w = img.shape[:2]

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    # Edge-preserving smoothing: flattens skin and plaster texture, keeps the
    # contours a pen would follow.
    smooth = gray.copy()
    for _ in range(3):
        smooth = cv2.bilateralFilter(smooth, 9, 0.08, 7)
    lum = cv2.GaussianBlur(smooth, (0, 0), 2.0)

    sub = subject_mask(img, cfg["mask"])

    # 主線 — two pen sizes: fine detail (eyes, beard) + a bolder contour pass.
    def pen(e: np.ndarray, t: float, gain: float) -> np.ndarray:
        return np.clip((-e - t) * gain, 0, 1)

    lines = np.maximum(pen(dog(smooth, 0.9), 0.0048, 110), pen(dog(smooth, 2.0), 0.011, 55))
    ink = (lines > 0.5).astype(np.uint8)
    _, lab, st, _ = cv2.connectedComponentsWithStats(ink, 8)
    specks = np.isin(lab, np.where(st[:, cv2.CC_STAT_AREA] < 18)[0]) & (ink > 0)
    lines[specks] = 0  # isolated specks read as noise, not pen work
    lines *= np.clip(sub * 1.2, 0, 1)  # a pen doesn't draw the wall's plaster

    # ベタ — the threshold is a signed field (negative = black) so it can be
    # scaled and re-thresholded at any output size with clean edges.
    black = cfg["tones"]["black"]
    black_t = np.full((h, w), black["default"], np.float32)
    ys = np.arange(h, dtype=np.float32)[:, None]
    for y0, y1, t in black.get("ramp", []):
        # e.g. a dark shirt: a darker cutoff below the chin, blended in over
        # [y0, y1] — a hard switch would draw a straight seam through the beard
        black_t += (t - black["default"]) * smoothstep(y0, y1, ys)
    beta_field = lum - black_t
    beta_field[sub <= 0.5] = 1.0  # the background never goes solid black

    # 網トーン — 0 at the darkest midtone, 1 at the highlight cutoff.
    tone_t = cfg["tones"]["highlight"]
    mid = np.clip((lum - black_t) / (tone_t - black_t), 0, 1)
    mid[lum >= tone_t] = 1.0

    # 白抜き — bright ridges inside the blacks only.
    ridge = dog(smooth, 1.2)
    cuts = np.clip((ridge - 0.016) * 120, 0, 1) * (lum < black_t)
    cuts *= cv2.GaussianBlur(smooth, (0, 0), 3) > 0.06

    return {"lines": lines, "beta": beta_field, "mid": mid, "cuts": cuts.astype(np.float32), "sub": sub}


# --------------------------------------------------------------- rendering --
def aa_below(field: np.ndarray, t: float = 0.0) -> np.ndarray:
    """Ink where field < t, anti-aliased: dividing by the gradient turns a
    value difference into an approximate pixel distance from the edge."""
    gy, gx = np.gradient(field)
    d = (t - field) / (np.hypot(gx, gy) + 1e-6)
    return np.clip(0.5 + d, 0, 1)


def screentone(coverage: np.ndarray, cell: float, angle: float = 45.0) -> np.ndarray:
    """Rotated halftone: dot area ∝ coverage, anti-aliased at the dot edge."""
    h, w = coverage.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.deg2rad(angle)
    u = (xx * np.cos(a) + yy * np.sin(a)) / cell
    v = (-xx * np.sin(a) + yy * np.cos(a)) / cell
    dist = np.hypot(u - np.round(u), v - np.round(v))   # in cell units
    radius = np.sqrt(coverage / np.pi)
    ink = np.clip(0.5 + (radius - dist) * cell, 0, 1)
    return np.where(coverage > 0, ink, 0)


def focus_lines(h: int, w: int, center, r_range, count: int, px: float, seed: int) -> np.ndarray:
    """集中線 — tapered radial wedges converging on the subject."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    cx, cy = center
    far = 2.2 * max(h, w)
    for _ in range(count):
        th = rng.uniform(0, 2 * np.pi)
        r0 = rng.uniform(*r_range)
        half = rng.uniform(0.25, 1.6) * px
        d = np.array([np.cos(th), np.sin(th)])
        n = np.array([-d[1], d[0]])
        p0 = np.array([cx, cy]) + d * r0
        p1 = np.array([cx, cy]) + d * far
        tri = np.array([p0, p1 + n * half, p1 - n * half]) * 4  # 2-bit subpixel precision
        cv2.fillPoly(out, [tri.astype(np.int32)], 1.0, lineType=cv2.LINE_AA, shift=2)
    return out


def render(maps: dict[str, np.ndarray], spec: dict, width: int, seed: int) -> Image.Image:
    x0, y0, cw, ch = spec["crop"]  # analysis-space crop
    height = round(width * ch / cw)
    s = width / cw                 # analysis px -> output px

    def up(name: str, interp=cv2.INTER_CUBIC) -> np.ndarray:
        region = maps[name][y0 : y0 + ch, x0 : x0 + cw]
        return cv2.resize(region, (width, height), interpolation=interp)

    beta = aa_below(up("beta"))
    lines = smoothstep(0.3, 0.7, up("lines"))
    cuts = smoothstep(0.35, 0.75, up("cuts")) * beta
    sub = up("sub")
    # Bold outer contour: a band around the mask's 0.5 isoline, ~1.1 analysis px wide.
    gy, gx = np.gradient(sub)
    dist = np.abs(sub - 0.5) / (np.hypot(gx, gy) + 1e-6)
    contour = np.clip(1.0 + 0.9 * s - dist, 0, 1) * (np.hypot(gx, gy) > 1e-4)

    mid = up("mid")
    steps = spec.get("toneSteps", 5)
    coverage = np.round((1 - mid) * steps) / steps * spec.get("toneMax", 0.55)
    coverage[mid >= 0.999] = 0
    cell = width / spec["dotsAcross"]
    tone = screentone(coverage, cell) * np.clip(sub * 1.5, 0, 1) * (1 - beta)

    ink = np.maximum.reduce([lines, contour, beta, tone]) * (1 - cuts)

    if "focus" in spec:
        f = spec["focus"]
        fx, fy = f["center"]
        r0, r1 = f["radius"]
        lines_bg = focus_lines(
            height, width, ((fx - x0) * s, (fy - y0) * s), (r0 * s, r1 * s),
            f.get("count", 260), px=max(1.0, 1.2 * s), seed=seed,
        )
        keep_out = cv2.GaussianBlur(sub, (0, 0), 3 * s)
        ink = np.maximum(ink, lines_bg * (1 - np.clip(keep_out * 1.6, 0, 1)))

    # Paper grain: a whisper of noise in the paper only, never in the ink.
    rng = np.random.default_rng(seed + 1)
    grain = np.abs(cv2.GaussianBlur(rng.normal(0, 1, (height, width)).astype(np.float32), (0, 0), 0.8))
    paper = np.clip(1 - ink - 0.03 * grain * (ink < 0.5), 0, 1)
    rgb = INK * (1 - paper[..., None]) + PAPER * paper[..., None]
    return Image.fromarray(rgb.astype(np.uint8), "RGB")


def main() -> None:
    cfg_path = Path(sys.argv[1] if len(sys.argv) > 1 else "scripts/manga-art/portrait.json")
    cfg = json.loads(cfg_path.read_text())
    maps = analyse(cfg)
    for i, spec in enumerate(cfg["outputs"]):
        out_dir = Path(spec.get("outDir", cfg["outDir"]))
        out_dir.mkdir(parents=True, exist_ok=True)
        for width in spec["widths"]:
            im = render(maps, spec, width, seed=11 + i)
            path = out_dir / f"{spec['name']}-{width}.webp"
            im.save(path, "WEBP", quality=spec.get("quality", 82), method=6)
            print(f"{path}  {im.width}x{im.height}  {path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
