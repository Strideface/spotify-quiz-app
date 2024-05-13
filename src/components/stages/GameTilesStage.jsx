import Authentication from "../Authentication";
import GameTile from "../GameTile";

export default function GameTilesStage() {
  return (
    <>
      <Authentication />
      <div className="grid grid-cols-2 gap-6 mx-8 mt-20">
        <GameTile
          title="Guess The Intro"
          description="A game where you need to identify the song and artist within an alloted timeframe"
        />
        <GameTile title="Another Game" description="Another game description" />
      </div>
    </>
  );
}
