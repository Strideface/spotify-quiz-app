import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

export default function BackToStartButton({ label, size, fullWidth, classes }) {
  const handleOnPress = () => {
    window.location.reload();
  };

  return (
    <motion.div
      className={`flex justify-center m-auto ${classes ? classes : ""}`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 2 } }}
    >
      <Button
        onPress={handleOnPress}
        size={size}
        color="primary"
        fullWidth={fullWidth}
        className=" font-medium text-mobile-3 sm:text-sm-screen-2"
      >
        {label}
      </Button>
    </motion.div>
  );
}
