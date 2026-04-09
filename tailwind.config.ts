import type { Config } from 'tailwindcss';

// @ts-ignore
import formPlugin from '@tailwindcss/forms';
// @ts-ignore
import containerQueriesPlugin from '@tailwindcss/container-queries';

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#481222",
        "secondary-fixed-dim": "#ffb379",
        "inverse-surface": "#fff8f7",
        "secondary-dim": "#ef9e5d",
        "surface-container": "#350817",
        "on-secondary-container": "#ffd8bd",
        "primary-dim": "#ff7072",
        "tertiary-fixed-dim": "#00efce",
        "on-tertiary-container": "#005d4f",
        "error": "#ff7351",
        "secondary-fixed": "#ffc69d",
        "outline": "#9e6572",
        "on-primary-fixed-variant": "#60000f",
        "error-dim": "#d53d18",
        "on-secondary-fixed-variant": "#7d4104",
        "tertiary-container": "#26fedc",
        "on-background": "#ffdde2",
        "on-error": "#450900",
        "on-primary": "#640010",
        "surface-dim": "#24020c",
        "outline-variant": "#6a3945",
        "on-primary-container": "#4e000a",
        "on-tertiary-fixed-variant": "#006859",
        "primary-fixed-dim": "#ff595f",
        "surface-tint": "#ff8d8c",
        "inverse-on-surface": "#794652",
        "surface-bright": "#511728",
        "on-tertiary": "#006657",
        "surface-container-lowest": "#000000",
        "on-surface-variant": "#da9aa7",
        "on-primary-fixed": "#000000",
        "on-tertiary-fixed": "#00483d",
        "on-secondary": "#5d2e00",
        "primary-fixed": "#ff7576",
        "secondary": "#ffab69",
        "on-error-container": "#ffd2c8",
        "primary-container": "#ff7576",
        "tertiary-fixed": "#26fedc",
        "error-container": "#b92902",
        "primary": "#ff8d8c",
        "surface-container-highest": "#481222",
        "secondary-container": "#7c4004",
        "surface-container-low": "#2c0411",
        "surface": "#24020c",
        "tertiary": "#b6ffed",
        "on-secondary-fixed": "#542900",
        "background": "#24020c",
        "on-surface": "#ffdde2",
        "inverse-primary": "#bc152d",
        "surface-container-high": "#3e0d1c",
        "tertiary-dim": "#00e8c9"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
        "label": ["Plus Jakarta Sans", "sans-serif"]
      }
    },
  },
  plugins: [
    formPlugin,
    containerQueriesPlugin
  ],
}

export default config
