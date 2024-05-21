import { useRef } from "react";

export default function SearchBar({ searchTerm, setSearchTerm }) {

  const lastChange = useRef();

// DEBOUNCING: only change searchTerm once user stops typing after specified time in setTimeout
// reduces amount of Spotify API calls (i.e. not after every key stroke)
  const handleOnChange = (value) => {
    if (lastChange.current) {
      clearTimeout(lastChange.current)
    }

    lastChange.current = setTimeout(() => {
        lastChange.current = null;
      setSearchTerm(value);
    }, 2000);

    // needs a useRef for the input element
  };

  return (
    <div className=" flex justify-center">
      <input
        type="search"
        name="search-form"
        id="search-form"
        onChange={(e) => handleOnChange(e.target.value)}
        placeholder="Search Spotify..."
      />
    </div>
  );
}
