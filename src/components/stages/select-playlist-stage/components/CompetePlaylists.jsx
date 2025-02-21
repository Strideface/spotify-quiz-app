import { useQuery } from "@tanstack/react-query";
import { fetchCompetePlaylists } from "../../../../util/spotify-api";
import PlaylistRow from "./PlaylistRow";
import { Spinner } from "@nextui-org/spinner";
import Alert from "../../../Alert";
import { useRedirectToSignIn } from "../../../../hooks/useRedirectToSignIn";

export default function UserPlaylists({ setPlaylistSelected }) {
  const {
    data: competePlaylistData,
    error: competePlaylistError,
    isError: competePlaylistIsError,
    isLoading: competePlaylistIsLoading,
  } = useQuery({
    queryKey: ["fetchCompetePlaylists"],
    queryFn: fetchCompetePlaylists,
    staleTime: 60000, // if 60 secs old, refetch data. Arbitrary but to reduce API calls.
    retry: 1,
  });

  // if no access or refresh token, redirect to sign-in
  useRedirectToSignIn(competePlaylistError);

  if (competePlaylistIsLoading) {
    return (
      <div className=" flex p-10 justify-center">
        <Spinner
          color="primary"
          label="Getting playlists..."
          labelColor="primary"
        />
      </div>
    );
  }

  if (competePlaylistIsError) {
    return <Alert message={competePlaylistError.message} />;
  }

  if (competePlaylistData) {
    return (
      <>
        <PlaylistRow
          playlistData={competePlaylistData}
          setPlaylistSelected={setPlaylistSelected}
        />
      </>
    );
  }
}
