import AsyncSelect from "react-select/async";
import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { fetchSearchedItems } from "../../../../util/spotify-api";

export default function SearchBar({ type }) {
  const { quizData } = useOutletContext();
  const [selectedValue, setSelectedValue] = useState();
  const lastChange = useRef();
  const searchBar = useRef();
  const error = useRef(); // could change this to state to ensure component gets rid of error message on re-render, unless there will be other state...

  // https://www.dhiwise.com/post/how-to-implement-a-react-search-bar-with-dropdown
  // https://react-select.com/home

  // function must return a promise
  const loadOptions = (inputValue) => {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    if (inputValue.trim().length !== 0) {
      let options = [];
      return new Promise((resolve) => {
        lastChange.current = setTimeout(() => {
          lastChange.current = null;

          resolve(
            fetchSearchedItems(
              inputValue,
              quizData.current.userDetails.country,
              type,
              5
            )
              .then((searchItemsData) => {
                error.current = null;
                searchItemsData.map((item) =>
                  options.push({
                    // put the first artist's name next to the track name if returning a track item. This is to distinguish when there are multiple tracks with the same name.
                    label: item.artists
                      ? item.name + ` (${item.artists[0].name})`
                      : item.name,
                    value: item.artists
                      ? item.name + ` (${item.artists[0].name})`
                      : item.name,
                    id: item.id,
                  })
                );
                return options;
              })
              .catch((err) => {
                error.current = err;
                return options;
              })
          );
        }, 2000);
      });
    }
  };

  const handleOnChange = (value) => {
    // setSelectedValue(value);
    console.log(value)
  };

  return (
    <>
      <AsyncSelect
        ref={searchBar}
        cacheOptions
        isClearable
        placeholder="search..."
        noOptionsMessage={() => "search for options"}
        loadOptions={loadOptions}
        onChange={(value) => handleOnChange(value)}

        // onInputChange={handleOnChange}
      />
      {error.current && <p>{error.current.message}</p>}
    </>
  );
}
