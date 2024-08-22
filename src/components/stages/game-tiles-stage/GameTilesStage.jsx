import { Divider } from "@nextui-org/divider";
import Authentication from "./components/Authentication";
import GameTile from "./components/GameTile";
import MusicIcon from "./components/images/MusicIcon";
import TrophyIcon from "./components/images/TrophyIcon";
import { motion } from "framer-motion";

export default function GameTilesStage() {
  return (
      <motion.div exit={{ x: -2000, opacity: 0, transition: {duration: 0.2}}}>
        <section className=" flex place-content-center pt-10 sm:pt-20 ">
          <Authentication />
        </section>

        <Divider className="m-auto mt-8 mb-8 border-t-large border-primary border-solid w-2/3" />

        <div className=" grid sm:grid-flow-col px-8 mb-20 gap-6 justify-evenly border-solid border-primary">
          <GameTile
            title="Custom Quiz"
            description="A quiz based on a selected playlist of your choosing. Search for a playlist or use one of your own!"
            image={<MusicIcon />}
            gameId="CUSTOM"
          />
          <GameTile
            title="Compete"
            description="Pre-selected playlists of various genres. Standardised to ensure players can be ranked on the leaderboard"
            image={<TrophyIcon />}
            gameId="COMPETE"
          />
        </div>
      </motion.div>
  );
}
