import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // Use /theveganshift/ for GitHub Pages, / for local development
    base: process.env.NODE_ENV === 'production' ? '/theveganshift/' : '/',
    server: {
        port: 5173,
        open: true,
        allowedHosts: ['.trycloudflare.com']
    },
    build: {
        outDir: 'dist'
    }
})
