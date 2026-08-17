/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2A4A",
        inkLight: "#24365A",
        paper: "#FAF6EC",
        paperDim: "#F1EBDA",
        marigold: "#E1993C",
        leaf: "#2F6B4F",
        redpen: "#C1443C",
        graphite: "#5B6472",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      boxShadow: {
        stamp: "6px 6px 0 #1B2A4A",
      },
    },
  },
  plugins: [],
};
