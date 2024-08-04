import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

export default function GameTile({ title, description, gameId }) {
  const { setQuizStage, isAuthenticated, quizData } = useOutletContext();

  const handleOnClick = () => {
    quizData.current.gameId = gameId;

    // else if because may want to add more games at a later point.
    if (quizData.current.gameId === "CUSTOM") {
      setQuizStage((prevState) => ({
        ...prevState,
        gameTilesStage: false,
        selectPlaylistStage: true,
      }));
    } else if (quizData.current.gameId === "COMPETE") {
      setQuizStage((prevState) => ({
        ...prevState,
        gameTilesStage: false,
        playQuizStage: true,
      }));
    }
  };

  return (
    <motion.div
      animate={{ y: 20 }}
      transition={{ duration: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card
        isPressable={isAuthenticated}
        onPress={isAuthenticated && handleOnClick}
        isDisabled={!isAuthenticated}
        shadow="none"
        classNames={{
          base: " bg-slate-200 hover:bg-background flex-auto border max-w-2xl",
          body: " text-center bg-primary hover:bg-spotify-green-2",
          header: " justify-center text-2xl",
        }}
        className=" font-medium"
      >
        <CardHeader>{title}</CardHeader>
        <Divider />
        <CardBody>{description}</CardBody>
      </Card>
    </motion.div>
  );

  // const authenticatedButton = (
  //   <button className=" hover:bg-spotify-green" onClick={handleOnClick}>
  //     <div className=" flex-auto border">
  //       <h1>{title}</h1>
  //       <p>{description}</p>
  //     </div>
  //   </button>
  // );

  // const unauthenticatedButton = (
  //   <button>
  //     <div className=" flex-auto border">
  //       <h1>{title}</h1>
  //       <p>{description}</p>
  //     </div>
  //   </button>
  // );

  // if (isAuthenticated) {
  //   return authenticatedButton;
  // } else {
  //   return unauthenticatedButton;
  // }
}
