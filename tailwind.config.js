/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        maxHeight: {
          '0': '0',
          '40': '10rem', // Adjust based on your needs
        },
        transitionProperty: {
          'max-height': 'max-height',
        },
        colors: {
          color1: "#22D3EE",
          color2: "#22D3EE",
          color3: "#22D3EE",
          color4: "#22D3EE",
        },
        fontFamily: {
          poppins: ["Poppins"],
        },
      },
    },
    plugins: [],
  };