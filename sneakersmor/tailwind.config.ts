import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          DEFAULT: "#EFEDE8",
          soft: "#F6F4F0"
        },
        asphalt: {
          DEFAULT: "#12141A",
          raised: "#191C23"
        },
        ember: {
          DEFAULT: "#FF5024",
          dim: "#D9431C"
        },
        jungle: {
          DEFAULT: "#1B4D3E",
          bright: "#2B7A5E"
        },
        chalk: "#F2F0EA",
        ink: "#0C0D10"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      borderRadius: {
        label: "2px"
      },
      boxShadow: {
        soft: "0 20px 60px -25px rgba(12,13,16,0.35)"
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        slideIn: "slideIn 0.5s cubic-bezier(0.16,1,0.3,1)",
        fadeUp: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1)"
      }
    }
  },
  plugins: []
};

export default config;
