export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        canvas: 'var(--color-canvas)',
        card: 'var(--color-card)',
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
          subtle: 'var(--color-ink-subtle)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
          subtle: 'var(--color-accent-subtle)',
          ink: 'var(--color-accent-ink)',
          hover: 'var(--color-accent-hover)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          soft: '#eeeeee',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          soft: '#eeeeee',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          soft: '#eeeeee',
        },
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
