/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1D4ED8', // Default primary color (you can adjust the hex value)
                    light: '#3B82F6', // Lighter shade of primary
                    dark: '#1E3A8A', // Darker shade of primary
                },
                secondary: {
                    DEFAULT: '#F97316', // Default secondary color
                    light: '#FB923C', // Lighter shade of secondary
                    dark: '#EA580C', // Darker shade of secondary
                },
                text: {
                    primary: '#111827', // Main text color (usually a dark color)
                    secondary: '#6B7280', // Secondary text color (often a lighter gray)
                    light: '#9CA3AF', // Light text color for subtle hints
                },
                background: {
                    DEFAULT: '#FFFFFF', // Default background color
                    dark: '#1F2937', // Dark background color (for dark mode)
                },
                border: {
                    DEFAULT: '#D1D5DB', // Default border color
                    dark: '#4B5563', // Dark border color (for dark mode)
                },
                error: {
                    DEFAULT: '#DC2626', // Error color (red)
                    light: '#F87171', // Lighter shade of error
                    dark: '#991B1B', // Darker shade of error
                },
                success: {
                    DEFAULT: '#10B981', // Success color (green)
                    light: '#34D399', // Lighter shade of success
                    dark: '#059669', // Darker shade of success
                },
                warning: {
                    DEFAULT: '#F59E0B', // Warning color (yellow)
                    light: '#FBBF24', // Lighter shade of warning
                    dark: '#B45309', // Darker shade of warning
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Example of custom font family
                serif: ['Roboto', 'serif'],
            },
        },
    },
    plugins: [],
}