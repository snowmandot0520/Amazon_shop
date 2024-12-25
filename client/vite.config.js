import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        // target: "http://localhost:5000",
        target: "http://148.251.126.212:5000",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react-highlight-words'],
  },
});
