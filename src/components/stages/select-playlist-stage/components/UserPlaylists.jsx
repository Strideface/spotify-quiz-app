import { useQuery } from "@tanstack/react-query";
import { fetchUserPlaylists } from "../../../../util/spotify-api";
import { useEffect } from "react";
import PlaylistRow from "./PlaylistRow";
import { Spinner } from "@nextui-org/spinner";
import Alert from "../../../Alert";
import { useOutletContext } from "react-router-dom";

export default function UserPlaylists({ setPlaylistSelected }) {
  const { setQuizStage } = useOutletContext();
  const {
    data: userPlaylistData,
    error: userPlaylistError,
    isError: userPlaylistIsError,
    isLoading: userPlaylistIsLoading,
  } = useQuery({
    queryKey: ["fetchUserPlaylists"],
    queryFn: fetchUserPlaylists,
    staleTime: 60000, // every 60 secs, refetch data. Arbitrary but to reduce API calls.
    // could have a situation where a user creates a new playlist and  wants to use it for the quiz.
    retry: 1,
  });

  // if refesh token fails, redirect to sign-in
  useEffect(() => {
    if (userPlaylistIsError) {
      if (userPlaylistError.info?.error === "invalid_grant") {
        setQuizStage((prevState) => ({
          ...prevState,
          gameTilesStage: true,
          selectPlaylistStage: false,
        }));
      }
    }
  }, [userPlaylistError, userPlaylistIsError, setQuizStage]);

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
