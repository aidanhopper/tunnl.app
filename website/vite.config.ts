import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3123",
                changeOrigin: true,
            },
            "/daemon.sock": {
                target: "http://localhost:3123",
                changeOrigin: true,
                ws: true,
            },
            "/resources": {
                target: "http://localhost:3123",
                changeOrigin: true,
            },
            "/web.sock": {
                target: "http://localhost:3123",
                changeOrigin: true,
                ws: true,
            },
        },
    },
})
