/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ["custom-pink"]: "#ffa1dd",
        ["custom-aqua"]: "#a3f3f0",
        ["custom-purple"]: "#d6caf0",
        ["custom-orange"]: "#ffcaa2",
        ["custom-yellow"]: "#fff8aa",
        ["custom-amber"]: "rgb(234 179 8)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    function ({ addUtilities }) {
      const colors = {
        "custom-purple-800": "#6B46C1",
        "custom-pink-500": "#EC4899",
      };

      const gradients = {};

      for (const [name, color] of Object.entries(colors)) {
        gradients[`.bg-gradient-to-${name}`] = {
          background: `linear-gradient(to right, ${colors[name]}, ${color})`,
        };
      }

      addUtilities(gradients, ["responsive", "hover"]);
    },
  ],
};
