import { defineConfig } from 'vite';

export default defineConfig({
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
