/** Couleurs de marque : à ajuster pour coller exactement à la charte Carte cadeau */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eef4fb", 100: "#d9e6f5", 500: "#2f6db5", 600: "#245a99", 700: "#1d4a7e", 900: "#10294a" },
        accent: { 400: "#f7c548", 500: "#f2b01e", 600: "#d99700" },
      },
      fontFamily: { sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"] },
    },
  },
  plugins: [],
};
