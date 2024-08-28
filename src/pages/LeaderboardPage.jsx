import { AnimatePresence } from "framer-motion";
import Leaderboard from "../components/leaderboard/LeaderBoard";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import Alert from "../components/Alert";

export default function LeaderboardPage() {
  const isOnline = useOnlineStatus();
  return (
    <AnimatePresence>
      {!isOnline && <Alert message="No Network Connection!" isBordered />}
      <Leaderboard key="leaderboard" />
    </AnimatePresence>
  );
}
