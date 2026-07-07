import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Modern baseline: esbuild stops emitting legacy transforms/polyfills.
    // Resolves the "avoid legacy JavaScript" diagnostic. Trade-off: drops
    // pre-2022 browsers (Safari < 15.4, no legacy Edge) — fine for a flagship
    // dev portfolio.
    target: 'es2022',
    // Vite 8 is Rolldown-based; its default minifier is Oxc (esbuild is no
    // longer bundled). Leave `minify` at the default — forcing 'esbuild' fails
    // the build. Kept as a comment so nobody re-adds minify:'esbuild'.
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split stable vendor libs from app code for long-term caching, so a
          // content-only change never busts the (large, rarely-changing) React
          // and GSAP chunks.
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id))
            return 'react-vendor';
          if (/[\\/]node_modules[\\/](gsap|@gsap[\\/]react|lenis)[\\/]/.test(id))
            return 'anim-vendor';
        },
      },
    },
  },
});
