import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@lib': path.resolve(__dirname, './src/shot-easy/lib'),
        '@states': path.resolve(__dirname, './src/shot-easy/states'),
        '@i18n': path.resolve(__dirname, './src/shot-easy/i18n'),
        '@components': path.resolve(__dirname, './src/shot-easy/components'),
        '@engines': path.resolve(__dirname, './src/shot-easy/engines'),
        '@layouts': path.resolve(__dirname, './src/shot-easy/layouts'),
        '@static': path.resolve(__dirname, './src/shot-easy/static'),
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
