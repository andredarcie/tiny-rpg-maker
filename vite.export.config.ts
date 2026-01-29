import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Paths relativos para compatibilidade com itch.io
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'TinyRPGExport',
      formats: ['iife'],
      fileName: () => 'export.bundle.js',
    },
    outDir: 'public',
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      inlineDynamicImports: true,
    },
  },
});
