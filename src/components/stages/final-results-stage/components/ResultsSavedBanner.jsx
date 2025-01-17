import { useMutationState } from "@tanstack/react-query";
import { useEffect } from "react";

// Get the mutation that added the user result and show it's status here
// Inspiration from: https://github.com/TanStack/query/discussions/986#discussioncomment-9425199

export default function ResultsSavedBanner() {
  //TODO: How to designate a genre to a compete playlist? At what stage of the app should it be done? Set to ROCK for now, for consistency during dev
  //TODO: find a way to only show the success or error message for 3 seconds and animate out. Should only run on first render.

  const mutationStatus = useMutationState({
    filters: { mutationKey: ["addUserResult"] },
    select: (mutation) => mutation.state.status,
  });

  return (
    <div>
      {mutationStatus[0] === "pending" && <h1>Saving results...</h1>}
      {mutationStatus[0] === "error" && <h1>Error: Could not save results</h1>}
      {mutationStatus[0] === "success" && <h1>Results saved!</h1>}
    </div>
  );
}
