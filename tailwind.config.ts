import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // WinWin Travel Premium Color Palette (HSL-tailored)
            colors: {
                brand: {
                    light: '#F8F9FA',
                    DEFAULT: '#1A1A1A', // Deep Charcoal
                    gold: '#D4AF37',    // Accents
                    muted: '#6C757D',
                },
                surface: {
                    glass: 'rgba(255, 255, 255, 0.7)',
                    dark: 'rgba(26, 26, 26, 0.95)',
                },
                primary: {
                    50: 'hsl(222, 100%, 97%)',
                    100: 'hsl(222, 100%, 94%)',
                    200: 'hsl(222, 100%, 88%)',
                    300: 'hsl(222, 95%, 78%)',
                    400: 'hsl(222, 90%, 65%)',
                    500: 'hsl(222, 85%, 55%)',
                    600: 'hsl(222, 80%, 45%)',
                    700: 'hsl(222, 75%, 38%)',
                    800: 'hsl(222, 70%, 30%)',
                    900: 'hsl(222, 65%, 25%)',
                    950: 'hsl(222, 60%, 15%)',
                },
                accent: {
                    50: 'hsl(36, 100%, 97%)',
                    100: 'hsl(36, 100%, 92%)',
                    200: 'hsl(36, 100%, 83%)',
                    300: 'hsl(36, 100%, 70%)',
                    400: 'hsl(36, 100%, 58%)',
                    500: 'hsl(36, 95%, 50%)',
                    600: 'hsl(30, 90%, 45%)',
                    700: 'hsl(26, 85%, 38%)',
                    800: 'hsl(22, 80%, 32%)',
                    900: 'hsl(18, 75%, 28%)',
                },
            },
            // Glassmorphism effects
            backdropBlur: {
                xs: '2px',
            },
            // Animation durations for premium UX
            transitionDuration: {
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
            },
            // Custom shadows for depth
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
                'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.12)',
                'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                'premium-lg': '0 30px 60px -15px rgba(0, 0, 0, 0.2)',
                'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            },
            // Font family for premium feel
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'serif'],
            },
            // Background patterns
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            // Keyframes for micro-animations
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.4s ease-out',
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                shimmer: 'shimmer 2s linear infinite',
            },
        },
    },
    plugins: [],
};

export default config;
