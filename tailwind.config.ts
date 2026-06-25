import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1a1714",
          soft: "#36302a",
          muted: "#6b6258",
        },
        cream: {
          DEFAULT: "#f6f1e7",
          deep: "#efe7d6",
          card: "#fffdf8",
        },
        clay: {
          DEFAULT: "#c63d2f",
          dark: "#a32b20",
          light: "#e06a52",
        },
        saffron: {
          DEFAULT: "#e8a13a",
          light: "#f4c46a",
        },
        pine: {
          DEFAULT: "#1f6f5c",
          light: "#2f9277",
        },
        line: "#e3d9c6",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      opacity: {
        8: "0.08",
        12: "0.12",
        15: "0.15",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,23,20,0.04), 0 12px 32px -16px rgba(26,23,20,0.18)",
        lift: "0 24px 60px -28px rgba(26,23,20,0.42)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
