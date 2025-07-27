/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#C5A875',
        light: '#F5F5F5',
        dark: '#1A1A1A',
        white: '#FFFFFF',
        gray: '#888888',
        'light-gray': '#EEEEEE',
      },
      fontFamily: {
        primary: ['Playfair Display', 'serif'],
        secondary: ['Poppins', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

