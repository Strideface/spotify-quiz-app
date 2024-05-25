import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import PlaylistRow from "./PlaylistRow";
import SearchBar from "./SearchBar";
import { fetchSearchedPlaylists } from "../util/spotify-api";
import LoadingIndicator from "./LoadingIndicator";

export default function SearchPlaylists() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchedPlaylistData,
    error: searchedPlaylistError,
    isError: searchedPlaylistIsError,
    isLoading: searchedPlaylistIsLoading,
    refetch: searchedPlaylistRefetch,
  } = useQuery({
    queryFn: () => fetchSearchedPlaylists(searchTerm),
    queryKey: ["fetchSearchedPlaylists"],
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    if (searchTerm) {
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
