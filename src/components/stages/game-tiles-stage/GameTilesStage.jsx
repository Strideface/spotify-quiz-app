import { Divider } from "@nextui-org/divider";
import Authentication from "./components/Authentication";
import GameTile from "./components/GameTile";

export default function GameTilesStage() {
  return (
    <>
      <section className=" flex place-content-center px-10 pt-10 sm:pt-20 ">
        <Authentication />
      </section>

      <Divider className="m-auto my-8 border-t-medium border-primary border-solid sm:max-w-screen-md" />

      <div className=" grid gap-6 justify-evenly p-8 sm:grid-flow-col sm:p-16 ">
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
