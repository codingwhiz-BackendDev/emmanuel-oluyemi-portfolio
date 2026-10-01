/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        popover: 'hsl(var(--popover))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        destructive: 'hsl(var(--destructive))',
        ink: 'hsl(var(--ink))',
        'ink-foreground': 'hsl(var(--ink-foreground))',
        brand: 'hsl(var(--brand))',
        'brand-light': 'hsl(var(--brand-light))',
        'brand-dark': 'hsl(var(--brand-dark))',
        'brand-foreground': 'hsl(var(--brand-foreground))',
      },
    },
  },
  plugins: [],
};
