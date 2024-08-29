import { Button } from "@nextui-org/button";
import Results from "./components/Results";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

export default function FinalResultsStage() {
  const { quizData, setQuizStage } = useOutletContext();

  const handleOnPress = () => {
    // app does not refresh if button is pressed so ensure results data is reset here, otherwise it will carry over.
    quizData.current.quizResults = {
      totalPoints: 0,
      totalCorrectArtists: 0,
      totalCorrectTracks: 0,
      totalSkipped: 0,
      totalTimerFinished: 0,
    };
    
    setQuizStage((prevState) => ({
      ...prevState,
      finalResultsStage: false,
      gameTilesStage: true,
    }));
  };

  return (
    <motion.div
      className=" flex-col justify-center p-5 mt-2 sm:mt-20"
      initial={{ x: 2000, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
    >
      <h1 className=" flex justify-center pb-5 font-semibold underline underline-offset-8 decoration-primary decoration-4 sm:text-sm-screen-2">
        Final Results
      </h1>
      <Results />

      <motion.div
        className=" flex justify-center max-w-xl m-auto mt-2 sm:mt-14"
        whileHover={{ scale: 1.05 }}
      >
        <Button
          onPress={handleOnPress}
          size="lg"
          color="primary"
          fullWidth
          className=" font-medium text-mobile-3 sm:text-sm-screen-2"
        >
          Play Again!
        </Button>
      </motion.div>
    </motion.div>
  );
}
