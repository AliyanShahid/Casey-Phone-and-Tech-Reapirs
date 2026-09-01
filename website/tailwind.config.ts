import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        casey: {
          charcoal: "#1E1E24",
          lime: "#A3E635",
          green: "#4ADE80",
          ink: "#15151B",
          mist: "#F5F7FA",
          steel: "#D8DEE8"
        }
      }
    }
  },
  plugins: []
};

export default config;
