import { motion } from "framer-motion";
import { Table, TableBody, TableHeader, TableColumn } from "@nextui-org/table";

export default function Leaderboard() {
  return (
    <motion.div
      className=" flex-col justify-center p-5 mt-20"
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
          <TableColumn></TableColumn>
          <TableColumn></TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Coming Soon...."}>{[]}</TableBody>
      </Table>
    </motion.div>
  );
}
