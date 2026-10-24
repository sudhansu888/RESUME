import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@react-pdf/renderer',
      'canvas-confetti',
      'lucide-react',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'gsap',
      'gsap/ScrollTrigger'
    ],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    modulePreload: {
      resolveDependencies(filename, deps) {
        // Exclude vendor-pdf from initial HTML modulepreload tags so it remains genuinely deferred
        return deps.filter(dep => !dep.includes('vendor-pdf') && !dep.includes('ResumePdfDocument'));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-pdf')) {
            return 'vendor-pdf';
          }
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('lucide-react') || id.includes('canvas-confetti') || id.includes('gsap')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
})
