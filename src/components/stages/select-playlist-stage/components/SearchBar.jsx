import { Input } from "@nextui-org/input";
import { useRef } from "react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  const lastChange = useRef();
  const searchBar = useRef();

  // DEBOUNCING: only change searchTerm once user stops typing after specified time in setTimeout
  // reduces amount of Spotify API calls (i.e. not after every key stroke)
  const handleOnChange = (value) => {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      setSearchTerm(value);
    }, 2000);
  };

  return (
    <Input
      ref={searchBar}
      type="search"
      name="search-form"
      id="search-form"
      onChange={(e) => handleOnChange(e.target.value)}
      placeholder={searchTerm ? searchTerm : "Search Spotify..."}
      fullWidth={false}
      radius="full"
    />

    // <div className=" flex justify-center">
    //   <input
    //     ref={searchBar}
    //     type="search"
    //     name="search-form"
    //     id="search-form"
    //     onChange={(e) => handleOnChange(e.target.value)}
    //     placeholder={searchTerm ? searchTerm : "Search Spotify..."}
    //   />
    // </div>
  );
}
