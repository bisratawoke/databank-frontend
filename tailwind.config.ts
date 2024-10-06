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
      },
    },
  },
  plugins: [],
};
export default config;
