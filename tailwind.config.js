const { nextui } = require("@nextui-org/theme");

// useful reading:
// concept of 'slots' to override styles - https://nextui.org/docs/customization/override-styles

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Tailwind
    "./src/**/*.{js,jsx,ts,tsx}",
    // NextUI
    "./node_modules/@nextui-org/theme/dist/components/(modal|popover|spinner|navbar|button|card|divider|image|accordion|spacer|input).js",
  ],
  // Tailwind
  theme: {
    // default screen sizes
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "spotify-green": "#1DB954",
        "spotify-green-2": "#1ed760",
        "spotify-white": "#FFFFFF",
        "spotify-black": "#191414",
      },
    },
  },
  // NextUI
  darkMode: "class",
  plugins: [
    // Required to style the search bar 'x'. See: https://github.com/tailwindlabs/tailwindcss/discussions/10190
    require('tailwindcss/plugin')(({ addVariant }) => {
      addVariant('search-cancel', '&::-webkit-search-cancel-button');
    }),
    // NextUI
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
        // Spotify colour palatte: https://www.pinterest.co.uk/pin/spotify-colors-palette-hex-colors-1db954-1ed760-ffffff-191414-brand-original-color-codes-colors-palette--816699713652575026/
        spotify: {
          layout: {
            fontSize: {
              tiny: "0.75rem", // text-tiny
              small: "0.875rem", // text-small
              medium: "1rem", // text-medium
              large: "1.125rem", // text-large
            },
          },
          colors: {
            background: "#FFFFFF", // "spotify-white"
            foreground: "#191414", // "spotify-black"
            danger: {
              DEFAULT: "#FFFFFF", // "spotify-white"
              foreground: "#e01616", // dark red
            },
            primary: "#1DB954", // "spotify-green",
            secondary: "#FFFFFF", // "spotify-white"
          },
        },
      },
    }),
  ],
};
