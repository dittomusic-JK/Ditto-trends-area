/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ditto Framework Colors
        "ditto-black": "var(--ditto-black)",
        "ditto-grey": "var(--ditto-grey)",
        "ditto-blue": "var(--blue)",
        "ditto-purple": "var(--ditto-purple)",
        "ditto-starter": "var(--ditto-starter)",
        "ditto-pro": "var(--ditto-pro)",
        "ditto-label": "var(--ditto-label)",
        "faded-grey": "var(--faded-grey)",
        "light-grey": "var(--light-grey)",
        "lighter-grey": "var(--lighter-grey)",
        "medium-grey": "var(--medium-grey)",
        "dark-grey": "var(--dark-grey)",
        "brand-border": "var(--brand-border)",
        "brand-secondary": "var(--brand-secondary)",
        "success": "var(--success)",
        "error": "var(--error)",
        "warning": "var(--warning)",
        "info": "var(--info)",
        // Custom chart colors
        "chart-purple": "#8640f4",
        "chart-coral": "#EF4444",
        // Legacy Anima tokens
        "ditto-bg-white": "var(--ditto-colors-light-dark-ditto-background-white)",
        "ditto-border-grey": "var(--ditto-colors-light-dark-ditto-border-grey)",
        "ditto-light-grey": "var(--ditto-colors-light-dark-ditto-light-grey)",
        "ditto-mid-grey": "var(--ditto-colors-light-dark-ditto-mid-button-grey)",
        "ditto-subtext": "var(--ditto-colors-light-dark-ditto-subtext-grey)",
        "ditto-text": "var(--ditto-colors-light-dark-ditto-text-fill)",
      },
      fontFamily: {
        "satoshi": ["Satoshi", "Helvetica", "Arial", "sans-serif"],
        "poppins": ["Poppins", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        "h1": ["2.625rem", { lineHeight: "3rem", letterSpacing: "-0.03em", fontWeight: "700" }],
        "h2": ["1.75rem", { lineHeight: "2.25rem", letterSpacing: "-1px" }],
        "h3": ["1.5rem", { lineHeight: "2rem" }],
        "h4": ["1.125rem", { lineHeight: "1.5rem" }],
        "body": ["1rem", { lineHeight: "1.5rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "xs": ["0.75rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "button": "2rem",
        "card": "1rem",
        "lg": "0.75rem",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
