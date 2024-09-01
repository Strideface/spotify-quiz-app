import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import SearchPlaylists from "./components/SearchPlaylists";
import UserPlaylists from "./components/UserPlaylists";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
} from "@nextui-org/modal";
import { useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Input } from "@nextui-org/input";
import { useAuthCheck } from "../../../hooks/useCheckAuth";
import BackToStartButton from "../../BackToStartButton";

export default function SelectPlaylistStage() {
  const { setQuizStage, quizData } = useOutletContext();

  const [playlistSelected, setPlaylistSelected] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [numberOfTracks, setNumberOfTracks] = useState();

  // Authentication check
  useAuthCheck();

  const handleOnSubmit = (event) => {
    // close modal first
    setPlaylistSelected(false);
    // assign selected total tracks for quiz
    if (isNaN(numberOfTracks)) {
      // handles if value is undefined which will be the case if..
      // initial placeholder value is not overwritten
      quizData.current.quizTotalTracks = quizData.current.playlistTotalTracks;
    } else {
      quizData.current.quizTotalTracks = numberOfTracks;
    }

    // assign selected difficulty level
    quizData.current.difficulty = selectedDifficulty;

    setQuizStage((prevState) => ({
      ...prevState,
      selectPlaylistStage: false,
      playQuizStage: true,
    }));
  };

  const handleOnClose = () => {
    // reset numberOfTracks to undefined because otherwise when a user selects a playlist again,
    // isInvalid in Input will still be true if the last numberOfTracks selected caused isInvalid to be true.
    setNumberOfTracks();
    setPlaylistSelected(false);
  };

  return (
    <motion.div
      initial={{ x: 2000, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
      exit={{ x: -2000, opacity: 0, transition: { duration: 0.2 } }}
    >
      <Modal
        isOpen={playlistSelected}
        onClose={handleOnClose}
        classNames={{
          header:
            " underline underline-offset-8 decoration-primary decoration-4 text-mobile-2 sm:text-sm-screen-2",
        }}
      >
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalBody>
            <div className=" flex justify-center">
              <p className=" text-mobile-2 sm:text-sm-screen-1">
                Select preferences:
              </p>
            </div>

            <Input
              className=" flex p-5 place-content-center"
              type="number"
              label="Number of tracks:"
              placeholder={
                quizData.current.playlistTotalTracks &&
                quizData.current.playlistTotalTracks.toString()
              }
              min="1"
              max={
                quizData.current.playlistTotalTracks &&
                quizData.current.playlistTotalTracks.toString()
              }
              isInvalid={
                numberOfTracks > quizData.current.playlistTotalTracks ||
                numberOfTracks < 1
              }
              errorMessage={`Invalid number selected (must be between 1 and ${quizData.current.playlistTotalTracks})`}
              onValueChange={(value) => setNumberOfTracks(parseInt(value))}
              size="md"
            />

            <div className=" flex p-5 justify-center">
              <RadioGroup
                label="Select difficulty:"
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
                classNames={{
                  label: " text-mobile-2 sm:text-sm-screen-1",
                  wrapper: " text-mobile-2 sm:text-sm-screen-1",
                }}
              >
                <Radio
                  classNames={{ label: " text-mobile-2 sm:text-sm-screen-1" }}
                  value="easy"
                >
                  easy
                </Radio>
                <Radio
                  classNames={{ label: " text-mobile-2 sm:text-sm-screen-1" }}
                  value="medium"
                >
                  medium
                </Radio>
                <Radio
                  classNames={{ label: " text-mobile-2 sm:text-sm-screen-1" }}
                  value="hard"
                >
                  hard
                </Radio>
              </RadioGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleOnClose}>
              Cancel
            </Button>
            <Button
              color="success"
              onPress={handleOnSubmit}
              isDisabled={
                numberOfTracks > quizData.current.playlistTotalTracks ||
                numberOfTracks === 0
              }
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Accordion
        defaultExpandedKeys={["2"]}
        selectionMode="multiple"
        keepContentMounted
        variant="splitted"
        itemClasses={{
          title: " font-semibold text-mobile-2 sm:text-sm-screen-2",
        }}
      >
        <AccordionItem
          key="1"
          title="Search Playlists"
          aria-label="Search Playlists"
          classNames={{ content: "justify-center" }}
        >
          <SearchPlaylists setPlaylistSelected={setPlaylistSelected} />
        </AccordionItem>
        <AccordionItem
          key="2"
          title="Your Playlists"
          aria-label="Your Playlists"
        >
          <UserPlaylists setPlaylistSelected={setPlaylistSelected} />
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
