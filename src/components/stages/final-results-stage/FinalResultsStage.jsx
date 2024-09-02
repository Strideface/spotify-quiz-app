import Results from "./components/Results";
import { motion } from "framer-motion";
import BackToStartButton from "../../BackToStartButton";

export default function FinalResultsStage() {
  return (
    <motion.div
      className=" flex-col overflow-auto justify-center p-5 mb-20 mt-2 sm:mt-20"
      initial={{ x: 2000, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
    >
      <h1 className=" flex justify-center pb-5 font-semibold underline underline-offset-8 decoration-primary decoration-4 sm:text-sm-screen-2">
        Final Results
      </h1>
      <Results />
        <BackToStartButton label="Play Again!" />
    </motion.div>
  );
}
