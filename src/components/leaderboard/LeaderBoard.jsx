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
import { useEffect, useState, useMemo } from "react";

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
    retry: 1,
  });

  // How the table items are sorted in ascending/descending order is taken from the following example:
  // https://www.heroui.com/docs/components/table#use-case-example

  // set the column key and direction of order
  // ## IMPORTANT: COLUMN KEYS MUST MATCH THE EXACT KEYS OF THE ITEMS USED TO MAP ONTO THE TABLE. ##
  // ALWAYS ENSURE THE FIELDS IN USERRESULT DOC FROM DB MATCH THE TABLE KEYS HERE
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "score",
    direction: "ascending",
  });

  // function that sorts user results. Returns empty array if data not fetched yet.
  // useMemo - Think of memoization as caching a value so that it does not need to be recalculated.
  // only runs when one of its dependencies update.
  const sortedItems = useMemo(() => {
    return userResultsData
      ? [...userResultsData].sort((a, b) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          const cmp = first < second ? -1 : first > second ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        })
      : [];
  }, [sortDescriptor, userResultsData]);

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
      <Table
        color="primary"
        classNames={{
          base: " max-w-xl m-auto",
          tbody: " sm:text-sm-screen-2 font-medium",
        }}
        aria-label="leaderboard table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
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
            items={sortedItems}
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
