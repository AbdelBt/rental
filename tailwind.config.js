/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#d4a853",
        dark: {
          DEFAULT: "#13131a",
          bg: "#0a0a0f",
          lighter: "#161620",
        },
        cream: "#f0eeea",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        sora: ["'Sora'", "sans-serif"],
      },
      accentColor: {
        gold: "#d4a853",
      },
    },
  },
  plugins: [],
};
