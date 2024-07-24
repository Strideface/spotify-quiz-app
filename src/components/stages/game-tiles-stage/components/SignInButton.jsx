import { Button } from "@nextui-org/button";
import { openSpotifyAuthenticationLink } from "../../../../util/spotify-api";

export default function SignInButton({ isLoading }) {
  const handleOnClick = () => openSpotifyAuthenticationLink();

  return (
    <Button
      onPress={handleOnClick}
      color="primary"
      size="lg"
      radius="full"
      isLoading={isLoading}
      id="signInSpotify"
      className=" hover:bg-spotify-green-2 text-foreground"
    >
      Sign in to Spotify
    </Button>
  );
  // return (
  //   <div>
  //     <a href={spotifyAuthenticationLink} id="signInSpotify">
  //       Sign in to Spotify
  //     </a>
  //   </div>
  // );
}
