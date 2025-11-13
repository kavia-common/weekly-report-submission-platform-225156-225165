/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D97706",
        secondary: "#F3F4F6",
        success: "#10B981",
        error: "#EF4444",
        champagne: {
          background: "#FFFBEB",
          surface: "#FFFFFF",
          text: "#374151"
        }
      },
      gradientColorStops: {
        amber50: "rgb(255 251 235)", // from-amber-50
        amber200: "rgb(253 230 138)" // to-amber-200
      },
      boxShadow: {
        soft: "0 10px 25px rgba(17, 24, 39, 0.08)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: []
};
