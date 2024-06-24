/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
  plugins: [],
};
