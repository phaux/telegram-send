/* eslint-env node */

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: (theme) => ({
        accent: theme.colors.cyan,
      }),
    },
  },
  // plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}
