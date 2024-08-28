import { useOutletContext } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import PlayQuizStage from "../components/stages/play-quiz-stage/PlayQuizStage";
import GameTilesStage from "../components/stages/game-tiles-stage/GameTilesStage";
import SelectPlaylistStage from "../components/stages/select-playlist-stage/SelectPlaylistStage";
import FinalResultsStage from "../components/stages/final-results-stage/FinalResultsStage";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import Alert from "../components/Alert";

export default function MainPage() {
  const { quizStage } = useOutletContext();
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && <Alert message="No Network Connection!" isBordered />}
      {quizStage.gameTilesStage && <GameTilesStage key="game-tiles-stage" />}
      {quizStage.selectPlaylistStage && (
        <SelectPlaylistStage key="select-playlist-stage" />
      )}
      {quizStage.playQuizStage && <PlayQuizStage key="play-quiz-stage" />}
      {quizStage.finalResultsStage && (
        <FinalResultsStage key="final-results-stage" />
      )}
    </AnimatePresence>
  );
}
