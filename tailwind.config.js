/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        island: {
          dark: "#0b0c10",
          surface: "rgba(18, 20, 29, 0.72)",
          border: "rgba(255, 255, 255, 0.12)",
          ring: "rgba(255, 255, 255, 0.08)",
        },
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "32px",
        "3xl": "48px",
      },
      boxShadow: {
        notch: "0 20px 50px -10px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
        innerGlow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
        islandCard: "0 8px 30px rgba(0, 0, 0, 0.45)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

