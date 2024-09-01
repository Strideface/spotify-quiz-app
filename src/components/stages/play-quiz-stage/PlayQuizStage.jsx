import { useOutletContext } from "react-router-dom";
import IntosQuiz from "./components/IntrosQuiz";
import CompeteQuiz from "./components/CompeteQuiz";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthCheck } from "../../../hooks/useCheckAuth";

export default function PlayQuizStage() {
  const { quizData } = useOutletContext();

  // Authentication check
  useAuthCheck();

  // render the relevant component correlating to the game chosen by the user during game tiles stage.

  return (
    <AnimatePresence>
      <motion.div
        // ! initial animation causes problem on mobile view
        initial={{opacity: 0 }}
        animate={{opacity: 1, transition: { delay: 0.3 } }}
        exit={{ x: -2000, opacity: 0, transition: { duration: 0.2 } }}
      >
        {quizData.current.gameId === "INTROS" && <IntosQuiz key="intros-quiz"/>}
        {quizData.current.gameId === "COMPETE" && <CompeteQuiz key="compete-quiz"/>}
      </motion.div>
    </AnimatePresence>
  );
}
