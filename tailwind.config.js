module.exports = {
  content: [
      './pages/**/*.{html,js,tsx,ts}',
    './components/**/*.{html,js,tsx,ts}',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '700px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  mode: 'jit',
}
