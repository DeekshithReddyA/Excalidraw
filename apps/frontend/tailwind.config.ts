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
        blue: {
          980 : '#181818',
          1000 : '#403e6a',
          1100 : '#232329'
        },
        purple: {
          1100 : "#dddcfe",
          1300 : "#5753d0"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
