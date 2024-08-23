import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PlaylistRow from "./PlaylistRow";
import SearchBar from "./SearchBar";
import { fetchSearchedItems } from "../../../../util/spotify-api";
import { useOutletContext } from "react-router-dom";
import { Spinner } from "@nextui-org/spinner";

export default function SearchPlaylists({ setPlaylistSelected }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { quizData } = useOutletContext();

  const {
    data: searchedPlaylistData,
    error: searchedPlaylistError,
    isError: searchedPlaylistIsError,
    isLoading: searchedPlaylistIsLoading,
    refetch: searchedItemsRefetch,
  } = useQuery({
    queryFn: () =>
      fetchSearchedItems(
        searchTerm,
        quizData.current.userDetails.country,
        "playlist",
        10
      ),
    queryKey: ["fetchSearchedPlaylistItems", { search: searchTerm }], // cache each unique search term
    refetchOnWindowFocus: false,
    enabled: searchTerm.trim().length !== 0, // enable when a searchTerm has a value so that caching queries work
    retry: 1,
  });
  // because playlistRow.jsx gets unmounted then remounted, searchTerm state is destroyed and not persisted.
  // This means a previous search result won't remain on screen when clicking to leaderboard and back again.
  // However, the result is cached by the query so if same search is performed, it gets served from cache quickly

  useEffect(() => {
    // don't send a request if the searchTerm value contains an empty string ("  ")
    // e.g. user only presses space or tab. This would result in a 400 error response from Spotify API.

    if (searchTerm.trim().length !== 0) {
      searchedItemsRefetch();
    }
  }, [searchTerm, searchedItemsRefetch]);

  return (
    <>
      {/* <div className=" flex p-10 justify-center">
        <h1>Search Playlists</h1>
      </div> */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {searchedPlaylistIsLoading && (
        <div className=" flex p-10 justify-center">
          <Spinner color="primary" />
        </div>
      )}
      {searchedPlaylistData && (
        <PlaylistRow
          playlistData={searchedPlaylistData}
          setPlaylistSelected={setPlaylistSelected}
        />
      )}
      {searchedPlaylistIsError && (
        <div className=" flex justify-center">
          <p className=" text-danger text-mobile-1 sm:text-sm-screen-1">
            {searchedPlaylistError.message}
          </p>
        </div>
      )}
    </>
  );
}
