/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                darkbg: '#090d16',
                cardbg: '#111726',
                cardborder: '#1e293b',
                brand: {
                    500: '#3b82f6',
                    400: '#60a5fa',
                }
            }
        },
    },
    plugins: [],
}