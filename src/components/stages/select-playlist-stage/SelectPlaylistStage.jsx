import { useOutletContext } from "react-router-dom";
import SearchPlaylists from "./components/SearchPlaylists";
import UserPlaylists from "./components/UserPlaylists";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
} from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Input } from "@nextui-org/input";

export default function SelectPlaylistStage() {
  const { isAuthenticated, setQuizStage, quizData } = useOutletContext();

  const [playlistSelected, setPlaylistSelected] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [numberOfTracks, setNumberOfTracks] = useState();

  if (!isAuthenticated) {
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: true,
      selectPlaylistStage: false,
    }));
  }

  const handleOnSubmit = (event) => {
    // assign selected total tracks for quiz
    quizData.current.quizTotalTracks = numberOfTracks;
    // assign selected difficulty level
    quizData.current.difficulty = selectedDifficulty;

    setQuizStage((prevState) => ({
      ...prevState,
      selectPlaylistStage: false,
      playQuizStage: true,
    }));
  };

  // for the 'cancel' button within ModalFooter only. Should match Modal's onClose attribute.
  const handleOnClose = () => {
    // reset numberOfTracks to 1 because otherwise when a user selects a playlist again,
    // isInvalid in Input will still be true if the last numberOfTracks selected caused isInvalid to be true.
    // 1 is a safe number as there will always be at least 1 track in a playlist and it won't trigger the conditions which make isInvalid true.
    setNumberOfTracks(1);
    setPlaylistSelected(false);
  };

  return (
    <>
      <Modal
        isOpen={playlistSelected}
        // eslint-disable-next-line no-sequences
        onClose={() => (setNumberOfTracks(1), setPlaylistSelected(false))}
      >
        <ModalContent>
          <ModalHeader>Quiz Settings</ModalHeader>
          <ModalBody>
            <div>
              <p>Select preferences:</p>
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
              >
                <Radio value="easy">easy</Radio>
                <Radio value="medium">medium</Radio>
                <Radio value="hard">hard</Radio>
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
    </>
  );
}
