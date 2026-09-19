/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // AquaSense Color Tokens
      colors: {
        // CSS Variable-based colors for theme switching
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#0A3D62', // Deep Ocean
          600: '#083351',
          700: '#062840',
          800: '#041D2F',
          900: '#02121E',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#E1F5FE',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6',
          500: '#1B7FBD', // Pool Blue
          600: '#1669A0',
          700: '#125383',
          800: '#0D3D66',
          900: '#082749',
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1', // Aqua
          400: '#26C6DA',
          500: '#00BCD4',
          600: '#00ACC1',
          700: '#0097A7',
          800: '#00838F',
          900: '#006064',
        },
        highlight: {
          DEFAULT: '#76E4C3', // Fresh Mint
          50: '#E8F8F5',
          100: '#D1F2EB',
          200: '#A3E4D7',
          300: '#76E4C3',
          400: '#48D1A6',
          500: '#1ABC9C',
          600: '#17A589',
          700: '#148F77',
          800: '#117864',
          900: '#0E6251',
        },
        neutral: {
          50: '#F7FBFC',
          100: '#EBF4F7',
          200: '#D9E7ED',
          300: '#C7DAE3',
          400: '#B5CDD9',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
        },
        // Semantic colors
        success: {
          light: '#76E4C3',
          DEFAULT: '#1ABC9C',
          dark: '#148F77',
        },
        warning: {
          light: '#FFE082',
          DEFAULT: '#FFC107',
          dark: '#FF8F00',
        },
        error: {
          light: '#EF5350',
          DEFAULT: '#D32F2F',
          dark: '#C62828',
        },
        info: {
          light: '#4DD0E1',
          DEFAULT: '#00BCD4',
          dark: '#0097A7',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand color shortcuts
        'deep-ocean': '#0A3D62',
        'pool-blue': '#1B7FBD',
        'aqua': '#4DD0E1',
        'fresh-mint': '#76E4C3',
      },
      
      // AquaSense Spacing Tokens (4px base unit)
      spacing: {
        0: '0',
        1: '0.25rem',    // 4px
        2: '0.5rem',     // 8px
        3: '0.75rem',    // 12px
        4: '1rem',       // 16px
        5: '1.25rem',    // 20px
        6: '1.5rem',     // 24px
        8: '2rem',       // 32px
        10: '2.5rem',    // 40px
        12: '3rem',      // 48px
        16: '4rem',      // 64px
        20: '5rem',      // 80px
        24: '6rem',      // 96px
        32: '8rem',      // 128px
      },

      // AquaSense Shadow Tokens
      boxShadow: {
        sm: '0 1px 2px 0 rgba(10, 61, 98, 0.05)',
        DEFAULT: '0 2px 8px 0 rgba(10, 61, 98, 0.08)',
        md: '0 4px 16px 0 rgba(10, 61, 98, 0.10)',
        lg: '0 8px 24px 0 rgba(10, 61, 98, 0.12)',
        xl: '0 16px 48px 0 rgba(10, 61, 98, 0.15)',
        '2xl': '0 24px 64px 0 rgba(10, 61, 98, 0.18)',
        glass: 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.1), 0 2px 8px 0 rgba(10, 61, 98, 0.08)',
        water: '0 4px 16px 0 rgba(77, 208, 225, 0.15)',
        // Dark mode shadows (use with dark: prefix)
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-DEFAULT': '0 2px 8px 0 rgba(0, 0, 0, 0.4)',
        'dark-md': '0 4px 16px 0 rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.6)',
        'dark-xl': '0 16px 48px 0 rgba(0, 0, 0, 0.7)',
        'dark-2xl': '0 24px 64px 0 rgba(0, 0, 0, 0.8)',
        'dark-glass': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.05), 0 2px 8px 0 rgba(0, 0, 0, 0.5)',
        'dark-water': '0 4px 16px 0 rgba(77, 208, 225, 0.25)',
      },

      // AquaSense Border Radius Tokens
      borderRadius: {
        none: '0',
        sm: '0.375rem',   // 6px
        DEFAULT: '0.5rem', // 8px
        md: '0.75rem',    // 12px
        lg: '1rem',       // 16px
        xl: '1.5rem',     // 24px
        '2xl': '2rem',    // 32px
        full: '9999px',
      },

      // AquaSense Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.375' }],      // 12px
        sm: ['0.875rem', { lineHeight: '1.5' }],       // 14px
        base: ['1rem', { lineHeight: '1.5' }],         // 16px
        lg: ['1.125rem', { lineHeight: '1.625' }],     // 18px
        xl: ['1.25rem', { lineHeight: '1.625' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.375' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '1.375' }],  // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1.25' }],       // 48px
        '6xl': ['3.75rem', { lineHeight: '1.25' }],    // 60px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // AquaSense Motion Tokens
      transitionTimingFunction: {
        'water-flow': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'water-ripple': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'water-wave': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
        slower: '600ms',
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
        // Water-inspired animations
        "ripple": {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        "wave": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ripple": "ripple 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "wave": "wave 3s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "float": "float 6s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
      },

      // Touch target sizes
      minHeight: {
        'touch': '44px', // Minimum touch target height for mobile
      },
      minWidth: {
        'touch': '44px', // Minimum touch target width for mobile
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

