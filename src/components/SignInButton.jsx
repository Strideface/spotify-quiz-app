import { spotifyAuthenticationLink } from "../util/spotify-api";

export default function () {
  return (
    <div>
      <a href={spotifyAuthenticationLink} id="signInSpotify">
        Sign in to Spotify
      </a>
    </div>
  );
}
