const { nextui } = require("@nextui-org/theme");

// useful reading:
// concept of 'slots' to override styles - https://nextui.org/docs/customization/override-styles

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Tailwind
    "./src/**/*.{js,jsx,ts,tsx}",
    // NextUI
    "./node_modules/@nextui-org/theme/dist/components/(modal|popover|spinner|navbar).js",
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
      prefix: "spotify", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "spotify", // default theme from the themes object
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
          layout: {
            fontSize: {
              tiny: "1rem", // text-tiny
              small: "1.75rem", // text-small
              medium: "2rem", // text-medium
              large: "4rem", // text-large
            },
          },
          colors: {
            background: "#FFFFFF", // "spotify-white"
            foreground: "#191414", // "spotify-black"
            danger: 
            {
              DEFAULT: "#FFFFFF", // "spotify-white"
              foreground: "#e01616", // dark red  
            },
            primary: "#1DB954", // "spotify-green"
          },
        },
      },
    }),
  ],
};
