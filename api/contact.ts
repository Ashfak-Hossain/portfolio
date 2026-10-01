import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createTransport } from 'nodemailer';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Best-effort rate limit: per warm instance, so it resets on cold start and
// isn't shared across regions. Enough to blunt a naive spam loop without
// adding a datastore.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Honeypot filled → a bot. Pretend success so it learns nothing.
  if (clean(req.body?.company, 200)) {
    return res.status(200).json({ ok: true });
  }

  if (rateLimited(clientIp(req))) {
    res.setHeader('Retry-After', String(WINDOW_MS / 1000));
    return res.status(429).json({ error: 'Too many messages — try again later' });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    // Misconfiguration: loud in the logs, generic to the client.
    console.error('contact: GMAIL_USER / GMAIL_APP_PASSWORD are not set');
    return res.status(500).json({ error: 'Mail is not configured' });
  }

  const name = clean(req.body?.name, 100);
  const email = clean(req.body?.email, 200);
  const message = clean(req.body?.message, 5000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Enter a valid email' });
  }

  try {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: email,
      subject: `New arc — message from ${name.replace(/[\r\n]+/g, ' ')}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact: send failed', err);
    return res.status(502).json({ error: 'Could not send message' });
  }
}
