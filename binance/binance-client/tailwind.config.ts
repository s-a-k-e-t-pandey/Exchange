import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        greenBackgroundTransparent: 'rgba(0, 194, 120, 0.08)',
        baseBackgroundL2: "rgb(32 33 39 / <alpha-value>)", // aplha-value is uded to dynamically assign opacity 
        greenText: "rgb(0, 194, 120 / <alpha-value>)",
        baseTextLowEmphasis: "rgb(117 121 138 / <alpha-value>)",
      },
    },
  },
  plugins: [],
} satisfies Config;
