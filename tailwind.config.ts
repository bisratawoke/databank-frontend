import type { Config } from "tailwindcss";

const config: Config = {
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
        navbardropdonw: "#F4F7F8",
        bluebrand: "#224986",
        navbarbackground: "#F4F7F8",
        brandgold: "#BB9271",
        lightbluebackground: "#E9F6FF",
      },
      keyframes: {
        progress: {
          '0%': { transform: 'scaleX(0)' },
          '40%': { transform: 'scaleX(0.4)' },
          '100%': { transform: 'scaleX(1)' },
        }
      },
      animation: {
        progress: 'progress 1.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
