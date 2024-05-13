import { createContext } from "react";

export const SpotifyContext = createContext({
  spotifyUserDetails: { DisplayName: null, userId: null, userImageUrl: null },
  playlistDetails: {playlistName: null, playlistId: null,}
});
// camel case because it acts like a react component when wrapping around other compnents
