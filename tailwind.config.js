const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Tailwind
    "./src/**/*.{js,jsx,ts,tsx}",
    // NextUI
    "./node_modules/@nextui-org/theme/dist/components/(modal|popover|spinner).js",
  ],
  // Tailwind
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1DB954",
        "spotify-white": "#FFFFFF",
        "spotify-black": "#191414",
      },
    },
  },
  extend: {
    width: {
      "playlist-card": "300px",
    },
    height: {
      "playlist-card": "300px",
    },
  },
  // NextUI
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "light", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {}, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {}, // dark theme colors
        },
        // ... custom themes
        spotify: {
          layout: {},
          colors: {},
        },
      },
    }),
  ],
};
