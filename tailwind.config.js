/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: (theme) => ({
        accent: theme.colors.cyan,
      }),
    },
  },
}
