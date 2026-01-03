/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Keep this 'class' so the ThemeContext can toggle dark mode
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2dd4bf', // teal-400
          DEFAULT: '#0d9488', // teal-600
          dark: '#0f766e', // teal-700
        },
      },
    },
  },
  plugins: [],
}