import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        studio: {
          sand: "#F6F0E8",
          ink: "#1F1A17",
          terracotta: "#B9633B",
          teal: "#0E6B6D",
          moss: "#5D6D4D",
          gold: "#D0A95B",
          void: "#070B15",
          night: "#111729",
          pink: "#FF1E9B",
          blue: "#2563FF",
          orange: "#FF8A00",
          green: "#30C85A"
        }
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      fontFamily: {
        sans: ['"Avenir Next"', '"Helvetica Neue"', '"Segoe UI"', "sans-serif"],
        display: ['"Avenir Next"', '"Helvetica Neue"', '"Segoe UI"', "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 80px rgba(32, 23, 17, 0.12)",
        card: "0 14px 50px rgba(18, 20, 16, 0.08)",
        cosmic: "0 30px 80px rgba(2, 6, 23, 0.55)",
        neon: "0 16px 40px rgba(255, 46, 156, 0.35)"
      },
      backgroundImage: {
        "paper-grid":
          "linear-gradient(to right, rgba(31, 26, 23, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(31, 26, 23, 0.06) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(circle at top left, rgba(208, 169, 91, 0.28), transparent 42%), radial-gradient(circle at 80% 15%, rgba(14, 107, 109, 0.18), transparent 28%), linear-gradient(135deg, rgba(246, 240, 232, 0.98), rgba(255, 255, 255, 0.94))",
        "cosmic-shell":
          "radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.18), transparent 22%), radial-gradient(circle at 75% 18%, rgba(244, 63, 94, 0.16), transparent 22%), radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.14), transparent 18%), linear-gradient(180deg, rgba(10, 14, 28, 0.98), rgba(5, 8, 17, 1))"
      }
    }
  },
  plugins: []
};

export default config;
