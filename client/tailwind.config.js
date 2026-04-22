export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',    // emerald green — modern, not golfsy
        secondary: '#6366F1',  // indigo
        dark: '#0F172A',
        card: '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};