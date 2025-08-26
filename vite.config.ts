import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // use a relative base so assets load correctly when deployed to GitHub Pages
  base: './',
  plugins: [react()],
});
