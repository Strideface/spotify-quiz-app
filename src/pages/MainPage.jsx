import { useOutletContext } from "react-router-dom";
import GameTilesStage from "../components/stages/GameTilesStage";
import SelectPlaylistStage from "../components/stages/SelectPlaylistStage";
import PlayQuizStage from "../components/stages/PlayQuizStage";

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
    return <PlayQuizStage />;
  }
}
