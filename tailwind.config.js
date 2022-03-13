module.exports = {
  content: [
      './pages/**/*.{html,js,tsx,ts}',
    './components/**/*.{html,js,tsx,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  mode: 'jit',
}
