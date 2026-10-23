import type { Contact, Footer } from '../types/content';

export const contact: Contact = {
  heading: 'Start a new arc.',
  sub: 'Got a hard problem worth solving? Send it over.',
  successJp: '送信完了',
  success: 'MESSAGE SENT',
  successNote: "Thanks — I'll reply within a day or two.",
  // POSTs to the Vercel serverless function in /api/contact, which emails via
  // your Gmail. Set to null to fall back to the visitor's mail client (mailto).
  endpoint: '/api/contact',
};

export const footer: Footer = {
  copyright: '© 2026 ASHFAK HOSSAIN EVAN',
  colophon: 'BEBAS NEUE · SPACE GROTESK · JETBRAINS MONO',
  disclaimer:
    'Unofficial fan homage — not affiliated with, endorsed by, or sponsored by Shueisha, Toei Animation, Eiichiro Oda, or Tite Kubo. All referenced names and marks belong to their respective owners.',
};
