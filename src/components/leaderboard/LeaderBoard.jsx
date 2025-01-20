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

export default function Leaderboard() {
  const {
    data: userResultsData,
    isFetching: userResultsIsFetching,
    isSuccess: userResultsIsSuccess,
    isError: userResultsIsError,
  } = useQuery({
    queryKey: ["fetchUserResults"],
    queryFn: fetchUserResults,
    staleTime: 60000, // if 60 secs old, refetch data. Arbitrary but to reduce API calls.
    retry: 1,
  });

  //TODO: create a user doc on firebase with an id that does not exist to see what spotify throws as the error, then
  // catch it and create an object with name and image as null or 'no longer exists'. To replicate if a user has
  // since deleted their account. Need to ensure the array from getUserResults is always the same length as array
  // from fetchUsers.

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
      >
        <TableHeader>
          <TableColumn>Player</TableColumn>
          <TableColumn>Genre</TableColumn>
          <TableColumn>Score</TableColumn>
          <TableColumn>Date</TableColumn>
        </TableHeader>
        {userResultsIsFetching && (
          <TableBody emptyContent={"Loading..."}>{[]}</TableBody>
        )}
        {userResultsIsError && (
          <TableBody
            emptyContent={"Sorry, an error occured. Please try again later."}
          >
            {[]}
          </TableBody>
        )}
        {userResultsData && userResultsData.length > 0 ? (
          <TableBody items={userResultsData}>
            {(item) => (
              <TableRow key={item.userId}>
                <TableCell>
                  <User
                    avatarProps={{
                      src: item.image,
                      alt: "user profile image",
                      showFallback: true,
                      size: "lg",
                      isBordered: true,
                      color: "primary",
                      radius: "sm",
                    }}
                    name={item.name}
                  />
                </TableCell>
                <TableCell>{item.playlist.genre}</TableCell>
                <TableCell>
                  {item.quizResults.percentageScore.toString()}
                </TableCell>
                {/* createdAt field is a firestore Timestamp instance and can be converted into a JS Date obj with toDate() */}
                <TableCell>{item.createdAt.toDate().toString()}</TableCell>
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No Results"}>{[]}</TableBody>
        )}
      </Table>
    </motion.div>
  );
}
