import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Promote the non-render-blocking (media="print") Google Fonts stylesheet to
// apply on screen. Kept out of index.html as an inline onload handler so the
// strict CSP (script-src 'self') doesn't block it.
const gfonts = document.getElementById('gfonts') as HTMLLinkElement | null;
if (gfonts) gfonts.media = 'all';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
