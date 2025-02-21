import { useState } from "react";
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";

export default function GenreFilterSelector({
  setItems,
  userResultsData,
  userResultsIsError,
}) {
  const [selectedGenre, setSelectedGenre] = useState([]);

  // FILTERING

  // compare function for filtering:
  const checkGenre = (item, genre) => {
    return item.genre === genre;
  };

  // when the user presses a value in the checkbox, onValueChange will trigger this function and
  // pass through the array of currently checked values (genres).
  const filterItemsByGenre = (genres) => {
    // 1) update selectedGenres
    setSelectedGenre(genres);

    // need to reset items to original state if there are no values checked, after previously having a value/values checked
    if (genres.length === 0) {
      setItems(userResultsData);
    } else {
      // 2) filter original array of items and return a new array of matches
      let filteredItems = [];
      // Remember, genres value is actually an array of one or more genres
      for (const genre of genres) {
        filteredItems.push(
          ...userResultsData.filter((item) => checkGenre(item, genre))
        );
      }
      // 3 set items to these filtered items
      setItems(filteredItems);
    }
  };

  return (
    <CheckboxGroup
      value={selectedGenre}
      onValueChange={(genres) => filterItemsByGenre(genres)}
      isDisabled={userResultsIsError && true}
      orientation="horizontal"
      radius="full"
      classNames={{
        wrapper: " justify-center rounded-full bg-foreground text-background",
      }}
    >
      <Checkbox
        value="Rock"
        classNames={{
          label: " text-background text-mobile-1 sm:text-sm-screen-1",
          wrapper: " bg-background",
          icon: "bg-foreground ",
        }}
      >
        Rock
      </Checkbox>
      <Checkbox
        value="Hip-Hop"
        classNames={{
          label: " text-background text-mobile-1 sm:text-sm-screen-1",
          wrapper: " bg-background",
          icon: "bg-foreground ",
        }}
      >
        Hip-Hop
      </Checkbox>
      <Checkbox
        value="Pop"
        classNames={{
          label: " text-background text-mobile-1 sm:text-sm-screen-1",
          wrapper: " bg-background",
          icon: "bg-foreground ",
        }}
      >
        Pop
      </Checkbox>
    </CheckboxGroup>
  );
}
