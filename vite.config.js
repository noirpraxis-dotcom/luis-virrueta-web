import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'react-core';
          }
          
          // React Router
          if (id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run')) {
            return 'react-router';
          }
          
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          
          // React Helmet
          if (id.includes('node_modules/react-helmet')) {
            return 'react-helmet';
          }
          
          // Blog translations (separate chunk)
          if (id.includes('/translations/') && 
              (id.includes('blog') || id.includes('article'))) {
            return 'blog-translations';
          }
          
          // Blog data (separate chunk)
          if (id.includes('/data/') && id.includes('blog')) {
            return 'blog-data';
          }
          
          // Blog pages
          if (id.includes('/pages/BlogPage.jsx')) {
            return 'blog-list';
          }
          
          if (id.includes('/pages/BlogArticlePage.jsx')) {
            return 'blog-article';
          }
          
          // Store pages
          if (id.includes('/pages/StorePage.jsx') || 
              id.includes('/pages/StoreProductPage.jsx')) {
            return 'store';
          }
          
          // Other vendor dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    sourcemap: false
  },
  server: {
    host: true,
    port: 3000
  }
})
