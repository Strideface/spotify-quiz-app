const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/(modal|popover|spinner).js",
  ],
  theme: {
    extend: {},
  },
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
      },
    }),
  ],
};

// module.exports = {
//   content: [
//     "./node_modules/@nextui-org/theme/dist/components/(modal| popover).js",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         "spotify-green": "#1DB954",
//         "spotify-white": "#FFFFFF",
//         "spotify-black": "#191414",
//       },
//     },
//   },
//   extend: {
//     width: {
//       "playlist-card": "300px",
//     },
//     height: {
//       "playlist-card": "300px",
//     },
//   },
//   darkMode: "class",
//   plugins: [nextui()],
// };
