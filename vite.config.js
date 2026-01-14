import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/theveganshift/', // GitHub Pages URL
    server: {
        port: 5173,
        open: true,
        allowedHosts: ['.trycloudflare.com']
    },
    build: {
        outDir: 'dist'
    }
})
