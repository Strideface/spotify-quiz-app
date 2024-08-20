import { useState } from "react";
import Quiz from "./Quiz";
import { useOutletContext } from "react-router-dom";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";

// present an introductory modal when component is rendered initially that explains how to play.
// Rules change depending on selected difficulty
// closes once 'Play' button is presed

export default function CustomQuiz() {
  const { quizData } = useOutletContext();
  const [inPlay, setInPlay] = useState(false);
  const [tracksReady, setTracksReady] = useState(false);

  const easy = (
    <ul>
      <li>
        Difficuly Selected:{" "}
        <span className=" text-primary underline">Easy</span>
      </li>
      <li>
        Time Limt per track: <span className=" underline">Unlimited</span>
      </li>
      <li>
        Repeat track limit: <span className=" underline">Unlimited</span>
      </li>
      <li>The whole track will play from the start</li>
    </ul>
  );

  const medium = (
    <ul>
      <li>
        Difficuly Selected:{" "}
        <span className=" text-orange-500 underline">Medium</span>
      </li>
      <li>
        Time Limt per track: <span className=" underline">30 seconds</span>
      </li>
      <li>
        Repeat track from start limit:{" "}
        <span className=" underline">Unlimited</span>
      </li>
      <li>A 30 second preview of the track can be played</li>
    </ul>
  );

  const hard = (
    <ul>
      <li>
        Difficuly Selected:{" "}
        <span className=" text-red-600 underline">Hard</span>
      </li>
      <li>
        Time Limt per track: <span className=" underline">30 seconds</span>
      </li>
      <li>
        Repeat track from start limit:{" "}
        <span className=" underline">Unlimited</span>
      </li>
      <li>A 10 second intro of the track can be played</li>
    </ul>
  );

  const handleOnClick = () => {
    setInPlay(true);
  };

  return (
    <>
      <Modal
        isOpen={!inPlay}
        hideCloseButton
        isDismissable
        size="lg"
        classNames={{
          body: "flex-col justify-center space-y-2 text-mobile-2 md:text-sm-screen-1",
          footer: " justify-center text-mobile-2 md:text-sm-screen-1",
          header:
            " underline underline-offset-8 decoration-primary decoration-4 text-mobile-3 md:text-sm-screen-2",
        }}
      >
        <ModalContent>
          <ModalHeader>Quiz Rules</ModalHeader>
          <ModalBody>
            <div>
              <ul className=" list-disc space-y-2">
                <li>
                  Identify the artist of the track first by searching the name
                  and then selecting an option.
                </li>
                <li>
                  Pick the track by selecting an option from the next dropdown
                  selection field.
                </li>
                <li>
                  Submit your answer or Skip if you don't know (An Artist and
                  Track must be selected to submit an answer).
                </li>
              </ul>
            </div>
            <div>
              <Card
                classNames={{
                  base: " bg-default-500 text-secondary font-medium",
                }}
              >
                <CardBody>
                  {quizData.current.difficulty === "easy" && easy}
                  {quizData.current.difficulty === "medium" && medium}
                  {quizData.current.difficulty === "hard" && hard}
                </CardBody>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-col justify-center space-y-2">
              <p>The quiz will start as soon as you hit 'Play'!</p>
              <Button
                color="success"
                onPress={handleOnClick}
                isLoading={!tracksReady}
              >
                Play
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Quiz inPlay={inPlay} setTracksReady={setTracksReady} />
    </>
  );
}
