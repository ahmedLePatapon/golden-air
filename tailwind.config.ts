import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config: Config = {
    content: [
        './app/**/*.{ts,tsx,js,jsx}',
        './components/**/*.{ts,tsx,js,jsx}',
        './pages/**/*.{ts,tsx,js,jsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#1152d4',
                'gold-accent': '#D4AF37',
                'background-dark': '#101622',
                anthracite: '#1a1f2b'
            },
            fontFamily: {
                jakarta: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
            }
        }
    },
    plugins: [forms]
}

export default config
