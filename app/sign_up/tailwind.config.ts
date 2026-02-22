// tailwind.config.ts
import { theme } from "@/src/app/theming";


/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: theme.colors.brand,
      },
      borderRadius: {
        ...theme.radius,
      },
      boxShadow: {
        ...theme.shadows,
      }
    },
  },
}