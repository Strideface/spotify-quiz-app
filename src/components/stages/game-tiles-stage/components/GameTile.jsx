import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

export default function GameTile({ title, description, image, gameId }) {
  const { setQuizStage, isAuthenticated, quizData } = useOutletContext();

  const handleOnClick = () => {
    // set the selected game
    quizData.current.gameId = gameId;
    // Move to the next stage, which will show either the compete or user and search playlists
    // depending on the game selected
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: false,
      selectPlaylistStage: true,
    }));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, transition: { duration: 1 } }}
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Card
        isPressable={isAuthenticated}
        onPress={isAuthenticated && handleOnClick}
        shadow="none"
        classNames={{
          base: " bg-foreground flex-auto border max-w-2xl",
          body: " space-y-8 text-background text-center font-medium text-mobile-3 sm:text-screen-2 bg-primary hover:bg-spotify-green-2",
          header:
            " justify-center font-semibold text-mobile-big sm:text-sm-screen-big text-primary hover:text-spotify-green-2",
        }}
      >
        <CardHeader>{title}</CardHeader>
        <Divider />
        <CardBody>
          <p>{description}</p>
          {image}
        </CardBody>
      </Card>
    </motion.div>
  );
}
