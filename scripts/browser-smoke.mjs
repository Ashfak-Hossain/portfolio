import { spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const targetUrl = process.env.PORTFOLIO_QA_URL ?? 'http://127.0.0.1:4173/';
const outputDir = process.env.PORTFOLIO_QA_OUTPUT ?? path.join(os.tmpdir(), 'portfolio-browser-smoke');

const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

let chromePath;
for (const candidate of candidates) {
  try {
    await access(candidate);
    chromePath = candidate;
    break;
  } catch {
    // Try the next known Chrome location.
  }
}

if (!chromePath) {
  throw new Error('Chrome was not found. Set CHROME_PATH to run browser smoke tests.');
}

await mkdir(outputDir, { recursive: true });
const profileDir = await mkdtemp(path.join(os.tmpdir(), 'portfolio-chrome-'));
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] },
);
const chromeExitPromise = new Promise((resolve) => chrome.once('exit', resolve));

let browserSocketResolve;
let browserSocketReject;
const browserSocketPromise = new Promise((resolve, reject) => {
  browserSocketResolve = resolve;
  browserSocketReject = reject;
});

let chromeStderr = '';
chrome.stderr.setEncoding('utf8');
chrome.stderr.on('data', (chunk) => {
  chromeStderr += chunk;
  const match = chromeStderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
  if (match) browserSocketResolve(match[1]);
});
chrome.once('exit', (code) => browserSocketReject(new Error(`Chrome exited early with code ${code}`)));

const timeout = setTimeout(() => browserSocketReject(new Error(`Chrome did not start. ${chromeStderr}`)), 15_000);

let socket;
let nextId = 0;
const pending = new Map();
const events = new Map();

function onEvent(method, handler) {
  const handlers = events.get(method) ?? new Set();
  handlers.add(handler);
  events.set(method, handlers);
  return () => handlers.delete(handler);
}

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function evaluate(expression) {
  return send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }).then((result) => {
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForReady() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(`document.readyState === 'complete'`);
    if (ready) {
      await evaluate(`document.fonts.ready.then(() => true)`);
      await delay(450);
      return;
    }
    await delay(100);
  }
  throw new Error('Page did not finish loading.');
}

async function navigate(width, height, reducedMotion = false) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
  await send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }],
  });
  await send('Page.navigate', { url: targetUrl });
  await waitForReady();
  await evaluate(`(async () => {
    const stops = [...document.querySelectorAll('main > section, #contact')];
    for (const stop of stops) {
      stop.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((resolve) => setTimeout(resolve, 250));
    return true;
  })()`);
}

async function inspectLayout(width, height) {
  return evaluate(`(() => {
    const keySelectors = ['nav', '#top', '#about', '#work', '#skills', '#connect', '#contact', 'footer'];
    const keyBounds = keySelectors.map((selector) => {
      const element = document.querySelector(selector);
      if (!element) return { selector, missing: true };
      const rect = element.getBoundingClientRect();
      return { selector, left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
    });
    const images = [...document.images].map((image) => ({
      src: image.getAttribute('src'),
      alt: image.getAttribute('alt'),
      loaded: image.complete && image.naturalWidth > 0,
    }));
    const unnamedControls = [...document.querySelectorAll('a,button,input,textarea')]
      .filter((element) => {
        const name = element.getAttribute('aria-label') || element.textContent?.trim() || element.getAttribute('placeholder');
        return !name;
      })
      .map((element) => element.outerHTML.slice(0, 140));
    return {
      expected: { width: ${width}, height: ${height} },
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      keyBounds,
      images,
      unnamedControls,
      headings: [...document.querySelectorAll('h1,h2,h3')].map((heading) => heading.textContent.trim()),
    };
  })()`);
}

const browserSocketUrl = await browserSocketPromise.finally(() => clearTimeout(timeout));
const debugBase = browserSocketUrl.replace(/^ws:/, 'http:').replace(/\/devtools\/browser\/.+$/, '');
const page = await fetch(`${debugBase}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' }).then((response) => response.json());
socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(`${message.error.message} (${message.error.code})`));
    else request.resolve(message.result);
    return;
  }
  for (const handler of events.get(message.method) ?? []) handler(message.params);
});

const consoleProblems = [];
onEvent('Runtime.exceptionThrown', ({ exceptionDetails }) => consoleProblems.push(`exception: ${exceptionDetails.text}`));
onEvent('Log.entryAdded', ({ entry }) => {
  if (entry.level === 'error' || entry.level === 'warning') {
    consoleProblems.push(`${entry.level}: ${entry.text}${entry.url ? ` (${entry.url})` : ''}`);
  }
});
onEvent('Runtime.consoleAPICalled', ({ type, args }) => {
  if (type === 'error' || type === 'warning') consoleProblems.push(`${type}: ${args.map((arg) => arg.value ?? arg.description).join(' ')}`);
});

await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Log.enable'), send('Accessibility.enable')]);

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
  { name: 'mobile-small', width: 320, height: 700 },
];
const reports = [];
const screenshotFiles = [];

try {
  for (const viewport of viewports) {
    await navigate(viewport.width, viewport.height);
    const report = await inspectLayout(viewport.width, viewport.height);
    reports.push({ name: viewport.name, ...report });

    if (report.viewport.width !== viewport.width) throw new Error(`${viewport.name}: viewport width mismatch`);
    if (report.scrollWidth > viewport.width + 1) throw new Error(`${viewport.name}: horizontal overflow ${report.scrollWidth}px`);
    const badBounds = report.keyBounds.filter((item) => item.missing || item.left < -1 || item.right > viewport.width + 1);
    if (badBounds.length) throw new Error(`${viewport.name}: section bounds failed ${JSON.stringify(badBounds)}`);
    const brokenImages = report.images.filter((image) => !image.loaded || !image.alt);
    if (brokenImages.length) throw new Error(`${viewport.name}: image checks failed ${JSON.stringify(brokenImages)}`);
    if (report.unnamedControls.length) throw new Error(`${viewport.name}: unnamed controls ${JSON.stringify(report.unnamedControls)}`);

    if (viewport.name === 'desktop' || viewport.name === 'mobile') {
      for (const [label, selector] of [
        ['top', '#top'],
        ['work', '#work'],
        ['skills', '#skills'],
        ['contact', '#contact'],
      ]) {
        await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ behavior: 'instant', block: 'start' })`);
        await delay(250);
        const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        const screenshotPath = path.join(outputDir, `${viewport.name}-${label}.png`);
        await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
        screenshotFiles.push(screenshotPath);
      }
      await evaluate(`window.scrollTo({ top: 0, behavior: 'instant' })`);
      await delay(150);
    }

    if (viewport.width <= 375) {
      const menu = await evaluate(`(async () => {
        const button = document.querySelector('button[aria-controls="mobile-menu"]');
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 120));
        const panel = document.querySelector('#mobile-menu');
        const rect = panel.getBoundingClientRect();
        return {
          expanded: button.getAttribute('aria-expanded'),
          visibility: getComputedStyle(panel).visibility,
          height: Math.round(rect.height),
          maxHeight: getComputedStyle(panel).maxHeight,
          links: panel.querySelectorAll('a').length,
        };
      })()`);
      if (menu.expanded !== 'true' || menu.visibility !== 'visible' || menu.links !== 5 || menu.height > viewport.height) {
        throw new Error(`${viewport.name}: mobile menu failed ${JSON.stringify(menu)}`);
      }
      const interaction = await evaluate(`(async () => {
        document.querySelector('button[aria-controls="mobile-menu"]').click();
        const haki = document.querySelector('#top button[aria-pressed]');
        haki.click();
        document.querySelectorAll('#work details').forEach((details) => { details.open = true; });
        await new Promise((resolve) => setTimeout(resolve, 120));
        return {
          menuClosed: document.querySelector('button[aria-controls="mobile-menu"]').getAttribute('aria-expanded'),
          hakiPressed: haki.getAttribute('aria-pressed'),
          detailsOpen: [...document.querySelectorAll('#work details')].every((details) => details.open),
        };
      })()`);
      if (interaction.menuClosed !== 'false' || interaction.hakiPressed !== 'true' || !interaction.detailsOpen) {
        throw new Error(`${viewport.name}: interactions failed ${JSON.stringify(interaction)}`);
      }
    }
  }

  await navigate(375, 812, true);
  const reduced = await evaluate(`({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    lenis: document.documentElement.classList.contains('lenis'),
    visibleReveals: [...document.querySelectorAll('[style*="opacity"]')].every((element) => getComputedStyle(element).opacity !== '0'),
  })`);
  if (!reduced.matches || reduced.lenis || !reduced.visibleReveals) {
    throw new Error(`Reduced-motion behavior failed ${JSON.stringify(reduced)}`);
  }

  const accessibilityTree = await send('Accessibility.getFullAXTree');
  const unnamedInteractive = accessibilityTree.nodes.filter((node) => {
    const role = node.role?.value;
    return ['button', 'link', 'textbox'].includes(role) && !node.name?.value;
  });
  if (unnamedInteractive.length) throw new Error(`Accessibility tree has ${unnamedInteractive.length} unnamed controls`);

  const ignoredLocalVercelScripts = ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js'];
  const filteredProblems = [...new Set(consoleProblems)].filter(
    (problem) => !ignoredLocalVercelScripts.some((pathname) => problem.includes(pathname)),
  );
  if (filteredProblems.length) throw new Error(`Browser console problems:\n${filteredProblems.join('\n')}`);

  const summary = {
    targetUrl,
    screenshots: screenshotFiles,
    viewports: reports.map(({ name, viewport, scrollWidth, images, headings }) => ({
      name,
      viewport,
      scrollWidth,
      images: images.length,
      headings: headings.length,
    })),
    interactions: ['mobile menu', 'Haki release', 'three project disclosures'],
    reducedMotion: reduced,
    consoleProblems: 0,
    accessibility: { unnamedInteractiveControls: 0 },
  };
  await writeFile(path.join(outputDir, 'report.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
} finally {
  socket?.close();
  chrome.kill('SIGTERM');
  await Promise.race([chromeExitPromise, delay(3_000)]);
  await rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
