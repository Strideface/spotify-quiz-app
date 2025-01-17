import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

export default function BackToStartButton({ label }) {
  const handleOnPress = () => {
    window.location.reload();
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
