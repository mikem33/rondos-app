import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    {
      name: 'copy-htaccess',
      closeBundle() {
        const src = path.resolve(__dirname, 'source/.htaccess')
        const dest = path.resolve(__dirname, 'build/.htaccess')
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest)
        } else {
          console.warn('[copy-htaccess] .htaccess not found at', src)
        }
      }
    }
  ],
  base: './',
  root: 'source',
  publicDir: false,
  build: {
    outDir: '../build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (ext === 'webmanifest') {
            return `[name][extname]`
          }
          if (/png|jpe?g|gif|svg|webp|ico/.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          } else if (ext === 'css') {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  css: {
    preprocessorOptions: {
      styl: {
        compress: false,
      },
    },
  },
})
