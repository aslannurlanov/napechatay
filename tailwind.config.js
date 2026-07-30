/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#181615",
        paper: "#fffdf9",
        milk: "#f8f3ec",
        blush: "#f6d8d2",
        clay: "#c98975",
        cocoa: "#6f5147",
        sage: "#8ab7a2",
        lilac: "#d9cff6",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(44, 32, 25, 0.10)",
        lift: "0 16px 38px rgba(44, 32, 25, 0.12)",
      },
    },
  },
  plugins: [],
};
