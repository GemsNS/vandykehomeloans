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
        // Nasdaq-style chrome: black through cool gray (PMS Cool Gray 1–11).
        ink: {
          DEFAULT: "#0B0D0E",
          950: "#000000",
          900: "#0B0D0E",
          800: "#16181A",
          700: "#212426",
          600: "#424242",
          500: "#595959",
          400: "#949494",
          300: "#BCBCBC",
          200: "#D1D1D1",
          100: "#E6E6E6",
          50: "#F4F6F7",
        },
        // Nasdaq Blue, PMS 313 C.
        brand: {
          DEFAULT: "#0092BC",
          50: "#E6F5FA",
          100: "#CCEAF4",
          200: "#99D5E9",
          300: "#5AC4E4",
          400: "#22ABD3",
          500: "#0092BC",
          600: "#007CA1",
          700: "#006585",
        },
        // Market tape direction. For mortgage rates, down is the good print.
        up: {
          DEFAULT: "#00B86B",
          soft: "#E6F8F0",
        },
        down: {
          DEFAULT: "#FF4B4B",
          soft: "#FFECEC",
        },
        // Neutralized from Tailwind's blue-tinted slate to match the cool gray ramp.
        slate: {
          DEFAULT: "#424242",
          400: "#949494",
          500: "#6E6E6E",
          600: "#595959",
          700: "#424242",
          800: "#212426",
          900: "#0B0D0E",
        },
        canvas: "#F4F6F7",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        board: "0.375rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 13, 14, 0.06), 0 8px 24px rgba(11, 13, 14, 0.06)",
        lift: "0 12px 40px rgba(11, 13, 14, 0.18)",
        glow: "0 0 0 1px rgba(0, 146, 188, 0.35), 0 0 32px rgba(0, 146, 188, 0.25)",
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
