const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/@nextui-org/theme/dist/components/(modal| popover).js",],
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
  darkMode: "class",
  plugins: [nextui()],
};
