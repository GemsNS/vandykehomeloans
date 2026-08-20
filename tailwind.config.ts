import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy taken from the VanDyke logo plate; 950 is the darkest chrome.
        ink: {
          DEFAULT: "#0B192C",
          950: "#050D18",
          900: "#0B192C",
          800: "#12243B",
          700: "#1B3050",
          600: "#3A4A63",
          500: "#4E5F79",
          400: "#8A97AA",
          300: "#B7C0CD",
          200: "#D5DBE4",
          100: "#E7EBF1",
          50: "#F5F7FA",
        },
        // Brushed gold from the logo. 300 for text on navy, 500 for surfaces,
        // 600+ only for text on light backgrounds (contrast).
        brand: {
          DEFAULT: "#C9A44C",
          50: "#FBF6E9",
          100: "#F6ECD2",
          200: "#EEDBA6",
          300: "#E3C77E",
          400: "#D5B25F",
          500: "#C9A44C",
          600: "#9C7A28",
          700: "#7A5F1C",
        },
        // Market tape direction. For mortgage rates, down is the good print.
        up: {
          DEFAULT: "#0E9F6E",
          soft: "#E6F6EF",
        },
        down: {
          DEFAULT: "#E5484D",
          soft: "#FDECEC",
        },
        // Navy-tinted neutrals so grays never read cold against the gold.
        slate: {
          DEFAULT: "#3A4A63",
          400: "#8A97AA",
          500: "#67748A",
          600: "#4E5F79",
          700: "#3A4A63",
          800: "#12243B",
          900: "#0B192C",
        },
        canvas: "#F7F5F1",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
        // Logo wordmark serif, used only for the brand lockup.
        brand: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        board: "0.375rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 25, 44, 0.06), 0 8px 24px rgba(11, 25, 44, 0.08)",
        lift: "0 12px 40px rgba(11, 25, 44, 0.22)",
        glow: "0 0 0 1px rgba(201, 164, 76, 0.4), 0 0 32px rgba(201, 164, 76, 0.22)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulse_dot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.85)" },
        },
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        "pulse-dot": "pulse_dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
