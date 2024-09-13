/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'archivo-black': ['"Archivo Black"', 'sans-serif'],
        'archivo': ['Archivo', 'sans-serif'],
      },
      colors: {
        'ascend-orange': '#e09016',
        'ascend-pink': '#d63cab',
        'ascend-blue': '#1556bf',
        'ascend-black': '#000000',
        'ascend-white': '#ffffff',
        'ascend-green': '#23cf2f',
      },
      animation: {
        "squiggle": "squiggle 1s infinite",
        "color-change": "color-change 5s infinite"
      },
      keyframes: {
        "squiggle":{"0%":{"transform":"translateX(0)"},"20%":{"transform":"translateX(-5px)"},"40%":{"transform":"translateX(5px)"},"60%":{"transform":"translateX(-3px)"},"80%":{"transform":"translateX(3px)"},"100%":{"transform":"translateX(0)"}},
        "color-change": {
          "0%, 100%": { color: "#e09016" },
          "20%": { color: "#d63cab" },
          "40%": { color: "#1556bf" },
          "60%": { color: "#23cf2f" },
          "80%": { color: "#ffffff" }
        }
      },
    },
  },
  plugins: [
    
  ],
}