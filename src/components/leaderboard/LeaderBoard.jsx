import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { User } from "@nextui-org/user";
import { fetchUserResults } from "../../util/firestoreDB-api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo, useRef } from "react";
import { Chip } from "@nextui-org/chip";
import { useOutletContext } from "react-router-dom";
import GenreFilterSelector from "./GenreFilterSelector";

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

  const { isAuthenticated } = useOutletContext();

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

  // sets color of chip component in the table cell for genres
  const chipColor = (genre) => {
    if (genre === "Rock") return "danger";
    if (genre === "Hip-Hop") return "success";
    if (genre === "Pop") return "warning";
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
      {!isAuthenticated && (
        <p className="flex justify-center pb-2 text-mobile-1 sm:text-sm-screen-1">
          *Sign in to reveal these Spotify users
        </p>
      )}

      <Table
        classNames={{
          base: " max-w-3xl m-auto bg-primary",
          wrapper: "max-h-[500px]",
          table: "h-80 max-h-[500px]",
          tbody: " sm:text-sm-screen-2 font-medium",
          th: " text-mobile-1 sm:text-sm-screen-1",
          td: " text-mobile-1 sm:text-sm-screen-1",
        }}
        aria-label="leaderboard table"
        sortDescriptor={sortDescriptor}
        onSortChange={({ column, direction }) =>
          handleOnSortChange({ column, direction })
        }
        topContent={
          <GenreFilterSelector
            setItems={setItems}
            userResultsData={userResultsData}
            userResultsIsError={userResultsIsError}
          />
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
                    classNames={{
                      name: " text-mobile-1 sm:text-sm-screen-1 max-w-[120px] sm:max-w-[240px] truncate",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    classNames={{
                      base: "sm:max-w-[80px]",
                      content: "sm:text-sm-screen-1",
                    }}
                    size="sm"
                    color={chipColor(item.genre)}
                  >
                    {item.genre}
                  </Chip>
                </TableCell>
                <TableCell>{item.score.toString() + "%"}</TableCell>
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
