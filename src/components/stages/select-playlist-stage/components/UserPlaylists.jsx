import { useQuery } from "@tanstack/react-query";
import { fetchUserPlaylists } from "../../../../util/spotify-api";
import PlaylistRow from "./PlaylistRow";
import { Spinner } from "@nextui-org/spinner";
import Alert from "../../../Alert";
import { useRedirectToSignIn } from "../../../../hooks/useRedirectToSignIn";

export default function UserPlaylists({ setPlaylistSelected }) {
  const {
    data: userPlaylistData,
    error: userPlaylistError,
    isError: userPlaylistIsError,
    isLoading: userPlaylistIsLoading,
  } = useQuery({
    queryKey: ["fetchUserPlaylists"],
    queryFn: fetchUserPlaylists,
    staleTime: 60000, // if 60 secs old, refetch data. Arbitrary but to reduce API calls.
    // could have a situation where a user creates a new playlist and  wants to use it for the quiz.
    retry: 1,
  });

  // if no access or refresh token, redirect to sign-in
  useRedirectToSignIn(userPlaylistError);

  if (userPlaylistIsLoading) {
    return (
      <div className=" flex p-10 justify-center">
        <Spinner
          color="primary"
          label="Getting your playlists..."
          labelColor="primary"
        />
      </div>
    );
  }

  if (userPlaylistIsError) {
    return <Alert message={userPlaylistError.message} />;
  }

  if (userPlaylistData) {
    return (
      <>
        <PlaylistRow
          playlistData={userPlaylistData}
          setPlaylistSelected={setPlaylistSelected}
        />
      </>
    );
  }
}
