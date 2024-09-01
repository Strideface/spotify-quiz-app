import { useOutletContext } from "react-router-dom";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

// IDEA WAS TO HAVE THIS BUTTON AVAILABLE THROUGHOUT THE STAGES TO GIVE USER OPTION OF RESTARTING INSTEAD OF FORCING THEM TO REFRESH THE BROWSER
// IF THEY WANT TO GO BACK TO THE START, AS THIS IS A SPA. IT'S CAUSING A BUG WITH THE CLASH OF ALL THE ANIMATIONS WHEN CHANGING COMPONENTS, 
// SO LEAVING IT OUT FOR NOW (apart from final results)

export default function BackToStartButton({ label }) {
  const { quizData, setQuizStage } = useOutletContext();

  const handleOnPress = () => {
    // app does not refresh if button is pressed so ensure results data is reset here, otherwise it will carry over
    // (if button is being pressed after compleition of a quiz - final results)
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
      className=" flex justify-center max-w-xl m-auto mt-2 sm:mt-14"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 2 } }}
    >
      <Button
        onPress={handleOnPress}
        size="lg"
        color="primary"
        fullWidth
        className=" font-medium text-mobile-3 sm:text-sm-screen-2"
      >
        {label}
      </Button>
    </motion.div>
  );
}
