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
  // else-if because may want to add more games at a later point.

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 2000, opacity: 0 }}
        animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        exit={{ x: -2000, opacity: 0, transition: { duration: 0.2 } }}
      >
        {quizData.current.gameId === "INTROS" && <IntosQuiz />}
        {quizData.current.gameId === "COMPETE" && <CompeteQuiz />}
      </motion.div>
    </AnimatePresence>
  );

  // if (quizData.current.gameId === "INTROS") {
  //   return <IntosQuiz />;
  // } else if (quizData.current.gameId === "COMPETE") {
  //   return <CompeteQuiz />;
  // }
}
