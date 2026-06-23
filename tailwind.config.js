/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal:  { DEFAULT: '#1C1A17', 600: '#2A2720', 400: '#3D3830' },
        amber:     { DEFAULT: '#C8860A', light: '#E09B1A', muted: '#D4A843' },
        ivory:     { DEFAULT: '#F5F0E8', warm: '#EDE5D8', sand: '#E8DFD0' },
        slate:     { DEFAULT: '#3D3830', light: '#5C5549' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};