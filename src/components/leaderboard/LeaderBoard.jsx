import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { User } from "@nextui-org/user";
import { fetchUserResults } from "../../util/firestoreDB-api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useRef } from "react";

export default function Leaderboard() {
  const {
    data: userResultsData,
    isFetching: userResultsIsFetching,
    isError: userResultsIsError,
    error: userResultsError,
  } = useQuery({
    queryKey: ["fetchUserResults"],
    queryFn: fetchUserResults,
    staleTime: 60000, // if 60 secs old, refetch data. Arbitrary but to reduce API calls.
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const [selectedGenre, setSelectedGenre] = useState([]);
  const [items, setItems] = useState([]);

  // On first render, run this effect so that items are set once data has been fetched.
  useEffect(() => {
    if (userResultsData) {
      setItems(userResultsData);
    }
  }, [userResultsData]);
  // as this runs any time userResultsData changes, it would refetch fresh data after staletime elapses, on a window refocus, meaning
  // any previously set filter would be lost as items is reset to the recently fetched data. To avoid this undesirable experience,
  // refetchOnWindowFocus has been set to false

  // set the column key and direction of order. Needs to be initialized to something so here it matches
  // the order it is retrieved from DB (the index for the userResults query in DB returns by score field and descending)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "score",
    direction: "descending",
  });
  // ## IMPORTANT: COLUMN KEYS MUST MATCH THE EXACT KEYS OF THE ITEMS USED TO MAP ONTO THE TABLE.
  // ALWAYS ENSURE THE FIELDS IN USERRESULT DOC FROM DB MATCH THE TABLE KEYS HERE ##

  // SORTING

  // When the user presses a sortable column header, the column's key and sort direction (defined in sortDescriptor)
  // is passed into the onSortChange callback (this function), allowing you to update the sortDescriptor appropriately.
  const handleOnSortChange = ({ column, direction }) => {
    // 1) update sortDescriptor
    setSortDescriptor({ column, direction });
    // 2) reset items according to sortDescriptor
    setItems(sortItems);
  };

  // How the table items are sorted in ascending/descending order is taken from the following example:
  // https://www.heroui.com/docs/components/table#use-case-example

  // "By default, the sort() function sorts values as strings. This works well for strings ("Apple" comes before "Banana").
  // However, if numbers are sorted as strings, "25" is bigger than "100", because "2" is bigger than "1".
  // Because of this, the sort() method will produce incorrect result when sorting numbers.
  // You can fix this by providing a compare function" - https://www.w3schools.com/js/js_array_sort.asp
  const sortItems = useMemo(() => {
    return items?.sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [items, sortDescriptor.column, sortDescriptor.direction]);

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
    <motion.div
      className=" flex-col justify-center p-5 mt-5 sm:mt-20"
      initial={{ x: 2000, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
      exit={{ x: -2000, opacity: 0, transition: { duration: 0.2 } }}
    >
      <h1 className=" flex justify-center pb-5 font-semibold underline underline-offset-8 decoration-primary decoration-4 sm:text-sm-screen-2">
        Leaderboard
      </h1>

      <div className="flex flex-col gap-3">
        <CheckboxGroup
          color="primary"
          value={selectedGenre}
          onValueChange={(genres) => filterItemsByGenre(genres)}
          label="Filter by Genre"
          orientation="horizontal"
        >
          <Checkbox value="Rock">Rock</Checkbox>
          <Checkbox value="Hip-Hop">Hip-Hop</Checkbox>
          <Checkbox value="Pop">Pop</Checkbox>
        </CheckboxGroup>
      </div>

      <Table
        color="primary"
        classNames={{
          base: " max-w-xl m-auto",
          tbody: " sm:text-sm-screen-2 font-medium",
        }}
        aria-label="leaderboard table"
        sortDescriptor={sortDescriptor}
        onSortChange={({ column, direction }) =>
          handleOnSortChange({ column, direction })
        }
      >
        <TableHeader>
          <TableColumn key="userName" allowsSorting>
            Player
          </TableColumn>
          <TableColumn key="genre" allowsSorting>
            Genre
          </TableColumn>
          <TableColumn key="score" allowsSorting>
            Score
          </TableColumn>
          <TableColumn key="date" allowsSorting>
            Date
          </TableColumn>
        </TableHeader>

        {!userResultsIsError ? (
          <TableBody
            isLoading={userResultsIsFetching}
            loadingContent="Loading..."
            emptyContent={"No Results"}
            items={items}
          >
            {(item) => (
              <TableRow key={item.key}>
                <TableCell>
                  <User
                    avatarProps={{
                      src: item.userImage,
                      alt: "user profile image",
                      showFallback: true,
                      size: "lg",
                      isBordered: true,
                      color: "primary",
                      radius: "sm",
                    }}
                    name={item.userName}
                  />
                </TableCell>
                <TableCell>{item.genre}</TableCell>
                <TableCell>{item.score.toString()}</TableCell>
                {/* createdAt field is a firestore TimeStamp class instance and can be converted into a JS Date obj with toDate() */}
                <TableCell>
                  {item.createdAt.toDate().toLocaleDateString()}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={userResultsError.message}>{[]}</TableBody>
        )}
      </Table>
    </motion.div>
  );
}
