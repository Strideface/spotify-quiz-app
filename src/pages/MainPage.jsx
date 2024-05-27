import { useOutletContext } from "react-router-dom";

import PlayQuizStage from "../components/stages/play-quiz-stage/PlayQuizStage";
import GameTilesStage from "../components/stages/game-tiles-stage/GameTilesStage";
import SelectPlaylistStage from "../components/stages/select-playlist-stage/SelectPlaylistStage";

export default function MainPage() {
  const { quizStage } = useOutletContext();

  // render content depending on the quiz 'flow' state
  if (quizStage.gameTilesStage) {
    return <GameTilesStage />;
  }
  if (quizStage.selectPlaylistStage) {
    return <SelectPlaylistStage />;
  }
  if (quizStage.playQuizStage) {
    return <PlayQuizStage />
  }
}
