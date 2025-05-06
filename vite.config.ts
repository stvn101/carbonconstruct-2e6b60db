
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      // Allow the specific host mentioned in the error
      '40569afc-2265-4f8d-91d9-12353c695c88.lovableproject.com',
      // Allow all lovable domains for future flexibility
      '*.lovableproject.com',
      '*.lovable.app'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Ensure sourcemaps are generated in production
    sourcemap: true,
    // Optimize chunk size for better performance
    chunkSizeWarningLimit: 1000,
  }
}));
