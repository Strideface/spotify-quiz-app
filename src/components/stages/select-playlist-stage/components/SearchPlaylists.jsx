import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import PlaylistRow from "./PlaylistRow";
import SearchBar from "./SearchBar";
import { fetchSearchedPlaylists } from "../../../../util/spotify-api";
import LoadingIndicator from "../../../LoadingIndicator";
import { useOutletContext } from "react-router-dom";

export default function SearchPlaylists() {
  const [searchTerm, setSearchTerm] = useState();
  const { quizData } = useOutletContext();

  const {
    data: searchedPlaylistData,
    error: searchedPlaylistError,
    isError: searchedPlaylistIsError,
    isLoading: searchedPlaylistIsLoading,
    refetch: searchedPlaylistRefetch,
  } = useQuery({
    queryFn: () =>
      fetchSearchedPlaylists(searchTerm, quizData.current.userDetails.country),
    queryKey: ["fetchSearchedPlaylists", { search: searchTerm }], // cache each unique search term
    refetchOnWindowFocus: false,
    enabled: searchTerm !== undefined, // enable when a searchTerm has a value so that caching queries work
  });
  // because playlistRow.jsx gets unmounted then remounted, searchTerm state is destroyed and not persisted.
  // This means a previous search result won't remain on screen when clicking to leaderboard and back again.
  // However, the result is cached by the query so if same search is performed, it gets served from cache quickly

  useEffect(() => {
    // don't send a request if the searchTerm value contains an empty string ("  ")
    // e.g. user only presses space or tab. This would result in a 400 error response from Spotify API.
    if (searchTerm) {
      if (searchTerm.trim().length !== 0) {
        searchedPlaylistRefetch();
      }
    }
  }, [searchTerm, searchedPlaylistRefetch]);

  return (
    <>
      <div className=" flex p-10 justify-center">
        <h1>Search Playlists</h1>
      </div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {searchedPlaylistIsLoading && <LoadingIndicator />}
      {searchedPlaylistData && (
        <PlaylistRow playlistData={searchedPlaylistData} />
      )}
      {searchedPlaylistIsError && <p>Error: {searchedPlaylistError.message}</p>}
    </>
  );
}
