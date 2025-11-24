/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        circle: {
          blue: '#0055FF', // Approximate Circle Blue
          dark: '#0A0B0D', // Deep background
          card: '#1A1B1F', // Card background
          text: '#F4F4F5', // Primary text
          muted: '#71717A', // Muted text
        }
      }
    },
  },
  plugins: [],
}
