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
    // The three.js / R3F scene is lazy-loaded into its own chunk, so a large
    // KatanaScene chunk is expected and fine — it never blocks first paint.
    chunkSizeWarningLimit: 1000,
  },
});
