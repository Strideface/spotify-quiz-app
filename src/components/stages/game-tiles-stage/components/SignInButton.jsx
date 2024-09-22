import { Button } from "@nextui-org/button";
import { openSpotifyAuthenticationLink } from "../../../../util/spotify-api";

export default function SignInButton({ isLoading }) {
  const handleOnClick = () => {
    openSpotifyAuthenticationLink();
  };

  return (
    <Button
      onPress={handleOnClick}
      color="primary"
      size="lg"
      radius="full"
      isLoading={isLoading}
      id="signInSpotify"
      className=" hover:bg-spotify-green-2 text-foreground font-medium sm:text-sm-screen-2"
    >
      Sign in to Spotify
    </Button>
  );
}
