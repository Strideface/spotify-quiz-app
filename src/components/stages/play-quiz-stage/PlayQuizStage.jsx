import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { checkAuth } from "../../../util/authentication";
import IntosQuiz from "./components/IntrosQuiz";
import CompeteQuiz from "./components/CompeteQuiz";
import { AnimatePresence, motion } from "framer-motion";

export default function PlayQuizStage() {
  const { quizData, isAuthenticated, setIsAuthenticated, setQuizStage } =
    useOutletContext();

  // Authentication check
  useEffect(() => {
    setIsAuthenticated(checkAuth());
    if (!isAuthenticated) {
      setQuizStage((prevState) => ({
        ...prevState,
        playQuizStage: false,
        gameTilesStage: true,
      }));
    }
  }, [isAuthenticated, setIsAuthenticated, setQuizStage]);

  // render the relevant component correlating to the game chosen by the user during game tiles stage.

  return (
    <AnimatePresence>
      <motion.div
        // initial animation causes problem on mobile view
        // initial={{ x: 2000, opacity: 0 }}
        // animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        exit={{ x: -2000, opacity: 0, transition: { duration: 0.2 } }}
      >
        {quizData.current.gameId === "INTROS" && <IntosQuiz />}
        {quizData.current.gameId === "COMPETE" && <CompeteQuiz />}
      </motion.div>
    </AnimatePresence>
  );
}
