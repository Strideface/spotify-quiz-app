import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Badge } from "@nextui-org/badge";
import { Avatar } from "@nextui-org/avatar";
import { useOutletContext } from "react-router-dom";

export default function Results() {
  const { quizData } = useOutletContext();

  const percentageScore = Math.floor(
    (quizData.current.quizResults.totalPoints /
      (quizData.current.quizTotalTracks * 2)) *
      100
  );

  return (
    <Table color="primary" classNames={{base: " max-w-xl m-auto", td: " sm:text-sm-screen-2 font-medium"}}>
      <TableHeader>
        <TableColumn></TableColumn>
        <TableColumn></TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>Correct Artists</TableCell>
          <TableCell>
            {quizData.current.quizResults.totalCorrectArtists}
          </TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Correct Tracks</TableCell>
          <TableCell>
            {quizData.current.quizResults.totalCorrectTracks}
          </TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Skiped</TableCell>
          <TableCell>{quizData.current.quizResults.totalSkipped}</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>Beaten by timer</TableCell>
          <TableCell>
            {quizData.current.quizResults.totalTimerFinished}
          </TableCell>
        </TableRow>
        <TableRow key="5" className=" bg-primary">
          <TableCell>Total Points Scored</TableCell>
          <TableCell className=" space-x-4">
            {quizData.current.quizResults.totalPoints} /{" "}
            {quizData.current.quizTotalTracks * 2}
            <Badge
          content={percentageScore + "%"}
          color={percentageScore >= 50 ? "success" : "warning"}
          size="lg"
          shape="circle"
        >
          <Avatar
            src={quizData.current.userDetails.image}
            showFallback
            size="lg"
            isBordered
            color="primary"
            radius="sm"
          />
        </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
