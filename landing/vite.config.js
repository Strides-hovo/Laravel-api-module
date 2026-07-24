import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
    plugins: [react()],
    // Режим разработки открывает с корня, а сборка (build) подставляет путь для GitHub Pages
    base: process.env.NODE_ENV === 'production' ? '/Laravel-api-module/' : '/',
})