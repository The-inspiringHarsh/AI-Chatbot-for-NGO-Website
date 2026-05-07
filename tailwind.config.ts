import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        foundation: {
          coral: "#ff6b5f",
          teal: "#20d4c7",
          gold: "#f9c74f",
          leaf: "#43aa8b"
        }
      },
      boxShadow: {
        glow: "0 0 50px rgba(32, 212, 199, 0.18)",
        panel: "0 24px 80px rgba(2, 8, 23, 0.28)"
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at 20% 10%, rgba(32,212,199,.22), transparent 28%), radial-gradient(circle at 82% 18%, rgba(255,107,95,.18), transparent 30%), radial-gradient(circle at 50% 100%, rgba(249,199,79,.16), transparent 36%)"
      }
    }
  },
  plugins: [typography]
};

export default config;
