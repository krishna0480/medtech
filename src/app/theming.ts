// lib/theming.ts

export const theme = {
  colors: {
    brand: {
      50: "#E6F0F4",
      100: "#B3D1DE",
      500: "#04374E", // Your main Navy color
      600: "#032C3E",
      700: "#02212F",
    },
    error: "#E53E3E", // Chakra default red.500
    success: "#38A169", // Chakra default green.500
  },
  radius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    outline: "0 0 0 3px rgba(4, 55, 78, 0.6)", // Custom brand outline
  }
} as const;

export type AppTheme = typeof theme;