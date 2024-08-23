import { AnimatePresence } from "framer-motion";
import Leaderboard from "../components/leaderboard/LeaderBoard";

export default function LeaderboardPage() {
  return (
    <AnimatePresence>
      <Leaderboard key="leaderboard" />
    </AnimatePresence>
  );
}
