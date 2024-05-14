import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";

import { checkAuth } from "../../util/authentication";
import LoadingIndicator from "../LoadingIndicator";
import { fetchUserPlaylists, fetchPlaylistTracks } from "../../util/spotify-api";
import { useEffect } from "react";

export default function SelectPlaylistStage() {
  const { isAuthenticated, setIsAuthenticated, setQuizStage } =
    useOutletContext();

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, [])


  if (!isAuthenticated) {
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: true,
      selectPlaylistStage: false,
    }));
  }

  const {
    data: userPlaylistData,
    error: userPlaylistError,
    isError: userPlaylistIsError,
    isLoading: userPlaylistIsLoading,
  } = useQuery({
    queryKey: ["fetchUserPlaylists"],
    queryFn: fetchUserPlaylists,
    staleTime: 60000, // every 60 secs
  });

  const handleOnClick = (playlistTracksHref) => fetchPlaylistTracks(playlistTracksHref);

  if (userPlaylistIsLoading) {
    return <LoadingIndicator />;
  }

  if (userPlaylistIsError) {
    return <p>Error: {userPlaylistError.message}</p>;
  }

  if (userPlaylistData) {
    return (
      <>
        <div>
          <h1>Your Playlists</h1>
        </div>
        <ul>
          {userPlaylistData.items.map((item) => (
            <li key={item.id}>
              <button onClick={() => handleOnClick(item.tracks.href)}>{item.name}</button>
              <span> / {item.tracks.total}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }
}
