import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "./LoadingIndicator";
import { fetchUserPlaylists } from "../util/spotify-api";
import PlaylistRow from "./PlaylistRow";

export default function UserPlaylists() {
  const {
    data: userPlaylistData,
    error: userPlaylistError,
    isError: userPlaylistIsError,
    isLoading: userPlaylistIsLoading,
  } = useQuery({
    queryKey: ["fetchUserPlaylists"],
    queryFn: fetchUserPlaylists,
    staleTime: 60000, // every 60 secs, refetch data. Aribitrary but to reduce API calls
  });


  if (userPlaylistIsLoading) {
    return <LoadingIndicator />;
  }

  if (userPlaylistIsError) {
    return <p>Error: {userPlaylistError.message}</p>;
  }

  if (userPlaylistData) {
    return (
      <>
        <div className=" flex p-10 justify-center">
          <h1>Your Playlists</h1>
        </div>
        <PlaylistRow playlistData={userPlaylistData} />
      </>
    );
  }
}
