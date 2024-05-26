import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import PlaylistRow from "./PlaylistRow";
import SearchBar from "./SearchBar";
import { fetchSearchedPlaylists } from "../util/spotify-api";
import LoadingIndicator from "./LoadingIndicator";

export default function SearchPlaylists() {
  const [searchTerm, setSearchTerm] = useState("");
  // set to "" instead of null or undefined as otherwise searchTerm.trim() in useEffect throws error

  const {
    data: searchedPlaylistData,
    error: searchedPlaylistError,
    isError: searchedPlaylistIsError,
    isLoading: searchedPlaylistIsLoading,
    refetch: searchedPlaylistRefetch,
  } = useQuery({
    queryFn: () => fetchSearchedPlaylists(searchTerm),
    queryKey: ["fetchSearchedPlaylists", { search: searchTerm }], // cache each unique search term
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    // don't send a request if the searchTerm value contains an empty string ("  ")
    // e.g. user only presses space or tab. This would result in a 400 error response from Spotify API.
    if (searchTerm.trim().length !== 0) {
      searchedPlaylistRefetch();
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
