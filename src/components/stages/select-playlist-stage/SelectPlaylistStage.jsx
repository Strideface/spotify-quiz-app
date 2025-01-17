import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import SearchPlaylists from "./components/SearchPlaylists";
import UserPlaylists from "./components/UserPlaylists";
import CompetePlaylists from "./components/CompetePlaylists";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
} from "@nextui-org/modal";
import { useState, useRef } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Input } from "@nextui-org/input";
import { useAuthCheck } from "../../../hooks/useCheckAuth";

export default function SelectPlaylistStage() {
  const { setQuizStage, quizData } = useOutletContext();

  const [playlistSelected, setPlaylistSelected] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [numberOfTracks, setNumberOfTracks] = useState();
  //set the default number of tracks for a compete quiz
  const competeNumberOfTracks = useRef(1); //TEST

  // Authentication check
  useAuthCheck();

  // assign selected total tracks for quiz
  const handleOnSubmit = (event) => {
    // close modal first
    setPlaylistSelected(false);

    // If value is undefined it wil be because the initial placeholder value has not been overwritten
    if (isNaN(numberOfTracks)) {
      // a) the reason is because it's a compete quiz and the value is predetermined
      if (quizData.current.gameId === "COMPETE") {
        quizData.current.quizTotalTracks = competeNumberOfTracks.current;
        // b) the user left the placeholder value unchanged so the onChange function did not run
      } else {
        quizData.current.quizTotalTracks =
          quizData.current.playlist.playlistTotalTracks;
      }
      // otherwise set to the selected value
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
                quizData.current.playlist.playlistTotalTracks &&
                quizData.current.playlist.playlistTotalTracks.toString()
              }
              min="1"
              max={
                quizData.current.playlist.playlistTotalTracks &&
                quizData.current.playlist.playlistTotalTracks.toString()
              }
              isInvalid={
                numberOfTracks >
                  quizData.current.playlist.playlistTotalTracks ||
                numberOfTracks < 1
              }
              errorMessage={`Invalid number selected (must be between 1 and ${quizData.current.playlist.playlistTotalTracks})`}
              onValueChange={(value) => setNumberOfTracks(parseInt(value))}
              size="md"
              // following options are set by default if it's a compete quiz
              defaultValue={
                quizData.current.gameId === "COMPETE" &&
                competeNumberOfTracks.current
              }
              isDisabled={quizData.current.gameId === "COMPETE" ? true : false}
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
                //if compete quiz then default is medium difficulty, which the state is initialised as. Hence, disabled options.
              >
                <Radio
                  classNames={{ label: " text-mobile-2 sm:text-sm-screen-1" }}
                  value="easy"
                  isDisabled={
                    quizData.current.gameId === "COMPETE" ? true : false
                  }
                >
                  easy
                </Radio>
                <Radio
                  classNames={{ label: " text-mobile-2 sm:text-sm-screen-1" }}
                  value="medium"
                  isDisabled={
                    quizData.current.gameId === "COMPETE" ? true : false
                  }
                >
                  medium
                </Radio>
                <Radio
                  classNames={{ label: " text-mobile-2 sm:text-sm-screen-1" }}
                  value="hard"
                  isDisabled={
                    quizData.current.gameId === "COMPETE" ? true : false
                  }
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
                numberOfTracks >
                  quizData.current.playlist.playlistTotalTracks ||
                numberOfTracks === 0
              }
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {quizData.current.gameId === "COMPETE" && (
        <Accordion
          defaultExpandedKeys={["1"]}
          keepContentMounted
          variant="splitted"
          className=" mb-20 mt-5"
          itemClasses={{
            title: "font-semibold text-mobile-2 sm:text-sm-screen-2",
          }}
        >
          <AccordionItem
            key="1"
            title="Compete Playlists"
            aria-label="Compete Playlists"
            classNames={{ content: "justify-center" }}
          >
            <CompetePlaylists setPlaylistSelected={setPlaylistSelected} />
          </AccordionItem>
        </Accordion>
      )}

      {quizData.current.gameId === "INTROS" && (
        <Accordion
          defaultExpandedKeys={["2"]}
          selectionMode="multiple"
          keepContentMounted
          variant="splitted"
          className=" mb-20 mt-5"
          itemClasses={{
            title: "font-semibold text-mobile-2 sm:text-sm-screen-2",
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
      )}
    </motion.div>
  );
}
