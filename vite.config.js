import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/theveganshift/', // Change this to your repo name
    server: {
        port: 5173,
        open: true,
        allowedHosts: ['.trycloudflare.com']
    },
    build: {
        outDir: 'dist'
    }
})
