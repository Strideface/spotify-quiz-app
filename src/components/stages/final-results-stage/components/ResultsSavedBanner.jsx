import { useMutationState } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "../../../Alert";

// Get the mutation that added the user result and show it's status here
// Inspiration from: https://github.com/TanStack/query/discussions/986#discussioncomment-9425199

export default function ResultsSavedBanner() {
  const mutationStatus = useMutationState({
    filters: { mutationKey: ["addUserResult"] },
    select: (mutation) => mutation.state.status,
  });

  // Initialize this state as false when this component is first rendered.
  // As it gets destroyed if a user navigates to the leaderboard from FinalResultsStage, if they were to navigate back,
  // state gets initialized once again but it should then be true.
  const [statusShown, setStatusShown] = useState(
    mutationStatus[0] === "success"
  );

  // set a timer to change state to true after a few seconds, thus only showing notification of status momentarily.
  useEffect(() => {
    if (mutationStatus[0] === "success") {
      setTimeout(() => {
        setStatusShown(true);
      }, 5000);
    }
  }, [mutationStatus]);

  return (
    <AnimatePresence>
      {!statusShown ? (
        <motion.div
          key="banner"
          exit={{ opacity: 0, duration: 5 }}
          className=" flex justify-center m-2"
        >
          {mutationStatus[0] === "pending" && (
            <Alert message="Saving results..." color="foreground" isBordered />
          )}
          {mutationStatus[0] === "error" && (
            <Alert message="Could not save results" isBordered />
          )}
          {mutationStatus[0] === "success" && (
            <Alert message="Results saved!" color="success" isBordered />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
