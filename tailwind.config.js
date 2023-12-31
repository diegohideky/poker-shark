/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: '#ffa1dd',
        aqua: '#a3f3f0',
        purple: '#d6caf0',
        orange: '#ffcaa2',
        yellow: '#fff8aa',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    function ({ addUtilities }) {
      const colors = {
        'purple-800': '#6B46C1',
        'pink-500': '#EC4899',
      };

      const gradients = {};

      for (const [name, color] of Object.entries(colors)) {
        gradients[`.bg-gradient-to-${name}`] = {
          background: `linear-gradient(to right, ${colors[name]}, ${color})`,
        };
      }

      addUtilities(gradients, ['responsive', 'hover']);
    },
  ],
}