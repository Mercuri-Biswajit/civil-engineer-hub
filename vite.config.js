import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@auth': resolve(__dirname, 'src/auth'),
      '@services': resolve(__dirname, 'src/services'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
