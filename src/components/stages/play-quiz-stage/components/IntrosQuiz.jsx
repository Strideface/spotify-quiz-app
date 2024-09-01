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
import { useQuery } from "@tanstack/react-query";
import { fetchPlaybackState } from "../../../../util/spotify-api";
import Alert from "../../../Alert";
import CorrectIcon from "../../../../images/CorrectIcon";
import { Progress } from "@nextui-org/progress";

// present an introductory modal when component is rendered initially that explains how to play.
// Rules change depending on selected difficulty
// closes once 'Play' button is presed

export default function IntrosQuiz() {
  const { quizData } = useOutletContext();
  const [inPlay, setInPlay] = useState(false);
  const [tracksReady, setTracksReady] = useState(false);
  const [error, setError] = useState(null);

  // also check for an active device and show the user a message in the modal
  const {
    isFetching: playbackStateisFetching,
    isError: playbackStateIsError,
    data: playbackStateData,
  } = useQuery({
    queryKey: ["fetchPlaybackState"],
    queryFn: () => fetchPlaybackState(),
    retry: 1,
    // only fetch playback state during modal display so it doesn't continue to refetch once it's closed and data call is no longer needed
    enabled: !inPlay,
  });

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
    <div>
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
        motionProps={{
          variants: {
            enter: { y: 0, opacity: 1, transition: { delay: 0.3 } },
            exit: { y: 200, opacity: 0 },
          },
        }}
      >
        <ModalContent>
          {!playbackStateIsError && (
            <div className=" flex justify-center m-1 space-x-1 text-mobile-2 md:text-sm-screen-1">
              {playbackStateisFetching ? (
                <Progress
                  label="Scanning for active device..."
                  size="sm"
                  color="default"
                  isIndeterminate
                  aria-label="scanning for device"
                />
              ) : playbackStateData ? (
                <>
                  <CorrectIcon color="success" width="16" height="16" />{" "}
                  <p>You have an active device</p>
                </>
              ) : (
                <Alert
                  message="This app needs your Spotify app to be active. Play a track now
                and activate it before starting the quiz."
                />
              )}
            </div>
          )}
          <ModalHeader>Rules</ModalHeader>
          <ModalBody>
            <div>
              <ul className=" list-disc space-y-2">
                <li>
                  Identify the artist of the track first by searching the name
                  and then selecting an option.
                </li>
                <li>
                  Pick the track by selecting an option from the next dropdown
                  field.
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
                isLoading={!error && !tracksReady}
                isDisabled={error}
                className={error && "bg-default-500"}
              >
                Play
              </Button>
              {error && (
                <p className=" text-danger text-mobile-1 sm:text-sm-screen-1">
                  {error.message}
                </p>
              )}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Quiz
        inPlay={inPlay}
        setTracksReady={setTracksReady}
        setError={setError}
      />
    </div>
  );
}
