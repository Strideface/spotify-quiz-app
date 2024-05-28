import AsyncSelect from "react-select/async";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function SearchBar({ setUserResponse }) {
  const lastChange = useRef();
  const searchBar = useRef();
  const [searchTerm, setSearchTerm] = useState();

// https://www.dhiwise.com/post/how-to-implement-a-react-search-bar-with-dropdown
// https://react-select.com/home

// TO DO: create fetch functions for tracks and artists. Make sure they return name and id or href, plus anything else needed.
// how to know which fetch function (artist or track) to be called in handleOnChange? useQueries?
  const {data: tracksData, error: tracksError, isError: tracksIsError, isLoading: tracksIsLoading} = useQuery({
    queryKey: null,
    queryFn: null,
    refetchOnWindowFocus: false,
    enabled: searchTerm !== undefined,
  })

  const {data: artistData, error: artistError, isError: artistIsError, isLoading: artistIsLoading} = useQuery({
    queryKey: null,
    queryFn: null,
    refetchOnWindowFocus: false,
    enabled: searchTerm !== undefined,
  })

  // TO DO: this will need to be an array of result objects for the AsyncSelect options. 
  let loadOptions = [];

  const handleOnChange = (inputValue) => {
    if (lastChange.current) {
        clearTimeout(lastChange.current);
      }
  
      lastChange.current = setTimeout(() => {
        lastChange.current = null;
        // setSearchTerm(inputValue)
        // if data, loadOptions.push(data.map{name: data.name and label: data.name})
      }, 2000);
  };

  return (
    <AsyncSelect loadOptions={loadOptions} onInputChange={handleOnChange} />
  );
}
