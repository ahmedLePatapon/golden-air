import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{ts,tsx,js,jsx}',
        './components/**/*.{ts,tsx,js,jsx}',
        './pages/**/*.{ts,tsx,js,jsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {/* Lines 48-138 omitted */ },
        },
    },
    plugins: [],
}

export default config
