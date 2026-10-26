/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // One family, defined once in src/index.css.
        sans: ['var(--font-sans)'],
      },
      // Only 400 and 700 are self-hosted, so the scale declares what actually renders.
      fontWeight: {
        normal: '400',
        medium: '400',
        semibold: '700',
        bold: '700',
      },
      colors: {
        brand: {
          50: '#ECFEFF',
          100: '#A5F3FC',
          DEFAULT: '#0891B2',
          600: '#0E7490',
          700: '#155E75',
          900: '#164E63',
        },
        // Semantic tokens from design-system/MASTER.md. Prefer these in new code.
        primary: 'var(--primary)',
        ink: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          faint: 'var(--fg-faint)',
        },
        surface: {
          DEFAULT: 'var(--card)',
          sunken: 'var(--bg)',
          raised: 'var(--surface-2)',
        },
        line: {
          DEFAULT: 'var(--border)',
          soft: 'var(--line)',
          control: 'var(--border-control)',
        },
        tint: {
          DEFAULT: 'var(--tint)',
          strong: 'var(--tint-strong)',
        },
        positive: {
          DEFAULT: 'var(--positive)',
          bg: 'var(--positive-bg)',
          ink: 'var(--positive-ink)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
          ink: 'var(--warning-ink)',
        },
        negative: {
          DEFAULT: 'var(--negative)',
          bg: 'var(--negative-bg)',
          ink: 'var(--negative-ink)',
        },
      },
      fontSize: {
        meta: ['var(--fs-meta)', { lineHeight: '1.4' }],
        body: ['var(--fs-body)', { lineHeight: '1.5' }],
        section: ['var(--fs-section)', { lineHeight: '1.3' }],
        page: ['var(--fs-page)', { lineHeight: '1.2' }],
      },
      borderRadius: {
        chip: 'var(--radius-chip)',
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
      },
    },
  },
  plugins: [],
};
