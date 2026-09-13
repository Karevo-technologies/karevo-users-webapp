/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // shadcn-ish tokens (used by our component classNames)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "muted-foreground": "hsl(var(--muted-foreground))",

        // Karevo shell tokens (blue + white)
        paper: "hsl(var(--paper) / <alpha-value>)",
        cloud: "hsl(var(--cloud) / <alpha-value>)",
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          soft: "hsl(var(--ink-soft) / <alpha-value>)",
        },
      },
      fontSize: {
        // Consolidated from ~23 ad hoc text-[Npx] values scattered across
        // dashboard pages into one named scale. Deliberately not named
        // xs/sm/base/... — those keys are Tailwind's default rem-based
        // scale and are already used elsewhere in this app; reusing them
        // here would silently change those too. No bundled line-height,
        // so each usage's existing leading-* class keeps behaving as before.
        5: "5px",
        8: "8px",
        10: "10px",
        11: "11px",
        12: "12px",
        13: "13px",
        14: "14px",
        15: "15px",
        16: "16px",
        17: "17px",
        18: "18px",
        32: "32px",
        38: "38px",
        64: "64px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "Space Grotesk",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "JetBrains Mono",
          "Cascadia Mono",
          "monospace",
        ],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
