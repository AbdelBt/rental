/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs existantes du projet
        gold: "#d4a853",
        dark: {
          DEFAULT: "#13131a",
          bg: "#0a0a0f",
          lighter: "#161620",
        },
        cream: "#f0eeea",
        // Variables CSS shadcn
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        destructive: "var(--destructive)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        sora: ["'Sora'", "sans-serif"],
        sans: ["'Geist Variable'", "sans-serif"],
      },
      accentColor: {
        gold: "#d4a853",
      },
    },
  },
  plugins: [],
};
