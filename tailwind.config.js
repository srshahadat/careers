/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#3b5bdb",
          600: "#2f4bc0",
          700: "#26399c",
          900: "#1a2661",
        },
      },
    },
  },
  plugins: [],
};
