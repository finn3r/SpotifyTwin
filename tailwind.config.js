module.exports = {
  content: [
      './pages/**/*.{html,js,tsx,ts}',
    './components/**/*.{html,js,tsx,ts}',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '700px',
        'xsm': '400px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
  ],
  mode: 'jit',
}
