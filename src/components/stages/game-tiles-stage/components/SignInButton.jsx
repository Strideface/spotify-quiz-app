import { openSpotifyAuthenticationLink } from "../../../../util/spotify-api";

export default function SignInButton() {
  const handleOnClick = () => openSpotifyAuthenticationLink();

  return (
    <button onClick={handleOnClick} id="signInSpotify">
      Sign in to Spotify
    </button>
  );
  // return (
  //   <div>
  //     <a href={spotifyAuthenticationLink} id="signInSpotify">
  //       Sign in to Spotify
  //     </a>
  //   </div>
  // );
}

  
