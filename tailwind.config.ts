import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#ffffff30",
        input: "#ffffff30",
        ring: "#ef4444",
        background: "#0a0a0a",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
          hover: "#dc2626",
          light: "#f87171",
        },
        secondary: {
          DEFAULT: "#1f2937",
          foreground: "#ffffff",
          hover: "#374151",
          light: "#4b5563",
        },
        accent: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
          hover: "#dc2626",
          light: "#f87171",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
          hover: "#dc2626",
        },
        muted: {
          DEFAULT: "#ffffff20",
          foreground: "#ffffff90",
          hover: "#ffffff30",
        },
        popover: {
          DEFAULT: "#ffffff05",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff05",
          foreground: "#ffffff",
          hover: "#ffffff10",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.1)" },
        },
        "pulse-slow-delay-2": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.1)" },
        },
        "pulse-slow-delay-4": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 8s ease-in-out infinite",
        "pulse-slow-delay-2": "pulse-slow 8s ease-in-out infinite 2s",
        "pulse-slow-delay-4": "pulse-slow 8s ease-in-out infinite 4s",
      },
      boxShadow: {
        'glow': '0 0 40px -5px rgba(239, 68, 68, 0.5), 0 0 20px -2px rgba(239, 68, 68, 0.3)',
        'glow-lg': '0 0 50px -5px rgba(239, 68, 68, 0.6), 0 0 30px -2px rgba(239, 68, 68, 0.4)',
        'inner-light': 'inset 0 2px 0 0 rgba(255, 255, 255, 0.1), inset 0 -2px 0 0 rgba(0, 0, 0, 0.2)',
        'depth': '0 20px 30px -8px rgba(0, 0, 0, 0.3), 0 10px 15px -5px rgba(0, 0, 0, 0.2), 0 0 20px -2px rgba(239, 68, 68, 0.2)',
        'depth-lg': '0 30px 40px -10px rgba(0, 0, 0, 0.4), 0 15px 20px -8px rgba(0, 0, 0, 0.3), 0 0 30px -3px rgba(239, 68, 68, 0.3)',
        'float': '0 35px 40px -10px rgba(0, 0, 0, 0.4), 0 20px 25px -8px rgba(0, 0, 0, 0.3), 0 0 40px -5px rgba(239, 68, 68, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        'gradient-glow': 'linear-gradient(45deg, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.4) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-animated': 'linear-gradient(45deg, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.4) 50%, rgba(239, 68, 68, 0.4) 100%)',
        'pattern-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
        'pattern-dots': 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
        'pattern-grid-large': 'linear-gradient(to right, rgba(255, 255, 255, 0.4) 2px, transparent 2px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 2px, transparent 2px)',
        'pattern-dots-large': 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 2px, transparent 0)',
        'pattern-grid-xl': 'linear-gradient(to right, rgba(255, 255, 255, 0.4) 3px, transparent 3px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 3px, transparent 3px)',
        'pattern-dots-xl': 'radial-gradient(circle at 3px 3px, rgba(255, 255, 255, 0.15) 3px, transparent 0)',
      },
      backgroundSize: {
        'grid': '40px 40px',
        'dots': '20px 20px',
        'grid-large': '80px 80px',
        'dots-large': '40px 40px',
        'grid-xl': '120px 120px',
        'dots-xl': '60px 60px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config; 