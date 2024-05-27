import Authentication from "./components/Authentication";
import GameTile from "./components/GameTile";

export default function GameTilesStage() {
  return (
    <>
      <Authentication />
      <div className="grid grid-cols-2 gap-6 mx-8 mt-20">
        <GameTile
          title="Custom Quiz"
          description="A quiz based on a selected playlist of your choosing. Search for a playlist or use one of your own!"
          gameId="CUSTOM"
        />
        <GameTile
          title="Compete"
          description="Pre-selected playlist of various genres. Standardised to ensure players can be ranked on the leaderboard"
          gameId="COMPETE"
        />
      </div>
    </>
  );
}
