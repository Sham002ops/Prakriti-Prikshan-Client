/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Fira Code"', 'monospace'], // Or your preferred monospaced font
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                'float-slow': 'float 12s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            colors: {
                green: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
            },
            boxShadow: {
                green: '0 4px 14px 0 rgba(34, 197, 94, 0.4)',
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.no-scrollbar': {
                    /* Firefox */
                    'scrollbar-width': 'none',
                    /* Safari and Chrome */
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
            });
        },
    ],
};
