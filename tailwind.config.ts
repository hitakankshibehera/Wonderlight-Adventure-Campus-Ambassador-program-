import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        wonder: {
          dark: {
            950: "#030712",
            900: "#090d16",
            850: "#0f1523",
            800: "#161f33",
            700: "#1e2942",
            600: "#334155",
          },
          emerald: {
            DEFAULT: "#10b981",
            glow: "#34d399",
            dark: "#059669",
            deep: "#064e3b",
          },
          gold: {
            DEFAULT: "#f59e0b",
            glow: "#fbbf24",
            dark: "#d97706",
            deep: "#78350f",
          },
          cyan: {
            DEFAULT: "#06b6d4",
            glow: "#22d3ee",
            dark: "#0891b2",
          },
          crimson: {
            DEFAULT: "#ef4444",
            glow: "#f87171",
            dark: "#b91c1c",
          }
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.4)",
        "glow-gold": "0 0 25px -5px rgba(245, 158, 11, 0.4)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 70%)",
        "mesh-dark": "radial-gradient(at 10% 20%, rgba(16, 185, 129, 0.08) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(245, 158, 11, 0.08) 0px, transparent 50%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
