import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { shuffleArray } from "../../../../util/util";

import AnswerSelection from "./AnswerSelection";
import PlayerControl from "./player/PlayerControl";
import CountdownTimer from "./CountdownTimer";
import { Chip } from "@nextui-org/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import CorrectIcon from "../../../../images/CorrectIcon";
import IncorrectIcon from "../../../../images/IncorrectIcon";
import BackToStartButton from "../../../BackToStartButton";

export default function Quiz({ inPlay, setTracksReady, setError }) {
  const activeTrackIndex = useRef();
  const [userResponse, setUserResponse] = useState([]);
  const [timerIsFinished, setTimerIsFinished] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const artistIsCorrect = useRef();
  const trackIsCorrect = useRef();

  activeTrackIndex.current = userResponse.length;

  const { quizData, setQuizStage } = useOutletContext();

  const {
    data: playlistTracksData,
    error: playlistTracksError,
    isError: playlistTracksIsError,
  } = useQuery({
    queryFn: () =>
      fetchPlaylistTracks(
        quizData.current.playlistTracksHref,
        quizData.current.userDetails.country,
        quizData.current.quizTotalTracks,
        quizData.current.playlistTotalTracks
      ),
    queryKey: [
      "fetchPlaylistTracks",
      { tracks: quizData.current.playlistTracksHref },
    ],
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Only get playlist tracks once. Data is never considered old so no auto refetches.
    retry: 2,
  });
  //! the query is not caching previous results, probably due to what's in the response header
  // 'Cache-Control: public, max-age=0'

  // get quiz tracks result from fetchPlaylistTracks once available
  useEffect(() => {
    if (playlistTracksData) {
      setError(null); // reset error in case there was one before
      // shuffle order of tracks before assignment
      shuffleArray(playlistTracksData);
      quizData.current.quizTracks = playlistTracksData;
      console.log(quizData.current);
      // inform parent component that quiz can be started.
      setTracksReady(true);
    }
  }, [playlistTracksData, quizData, setError, setTracksReady]);

  // if error, inform parent component that has the modal so message can be displayed there.
  useEffect(() => {
    if (playlistTracksIsError) {
      setError(playlistTracksError);
    }
  }, [playlistTracksIsError, playlistTracksError, setError]);

  // inPlay will only change once, when user closes modal in the parent component. Set timer when inPlay changes.
  useEffect(() => {
    if (inPlay) {
      setTimerIsFinished(false);
    }
  }, [inPlay, setTimerIsFinished]);

  // this useEffect opens the results modal to show the result of the latest answer submission, each time a new response is submitted.
  useEffect(() => {
    if (userResponse.length > 0) {
      setModalIsOpen(true);
    }
  }, [userResponse]);

  // handles scenario where timer runs out
  const handleTimerIsFinished = () => {
    quizData.current.quizResults.totalTimerFinished += 1;
    artistIsCorrect.current = false;
    trackIsCorrect.current = false;
    setUserResponse((prevState) => {
      return [...prevState, "TIMER-FINISHED"];
    });
  };

  const handleModalOnClick = () => {
    // change UI to the final results stage once tracks are exhausted
    if (userResponse.length === quizData.current.quizTracks.length) {
      setModalIsOpen(false);
      setQuizStage((prevState) => ({
        ...prevState,
        playQuizStage: false,
        finalResultsStage: true,
      }));
    } else {
      setModalIsOpen(false);
      setTimerIsFinished(false);
    }
  };

  // IMPORTANT NOTE ABOUT KEYS
  // have to make the set of keys unique for each sibling component within a parent
  // for react to recognize that they have been unmounted from the DOM.
  // crucial for framer motion to work as it won't animate if react can't distinguish whether components have mounted/unmounted.

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onClose={handleModalOnClick}
        isDismissable={false}
        isKeyboardDismissDisabled
        hideCloseButton
        size="full"
        radius="lg"
        classNames={{
          base: "flex-1 overflow-auto sm:max-w-3xl sm:max-h-[490px] sm:!rounded-lg",
          header:
            " justify-center underline underline-offset-8 decoration-primary decoration-4 text-mobile-3 sm:text-sm-screen-2",
          body: " sm:flex-row divide-y-large sm:divide-y-0 sm:divide-x-large divide-foreground",
        }}
        motionProps={{
          variants: {
            enter: { y: 0, opacity: 1 },
            exit: { y: 200, opacity: 0 },
          },
        }}
      >
        <ModalContent>
          <ModalHeader>Result</ModalHeader>
          <ModalBody>
            <div className="flex flex-none justify-center items-center">
              <Card
                classNames={{
                  base: "flex-none justify-center border py-3 w-60 sm:w-80 sm:h-80 bg-foreground",
                  body: "overflow-visible py-1 ",
                }}
              >
                <CardBody>
                  <Image
                    alt="Artist Image"
                    className="object-cover rounded-xl aspect-square "
                    src={
                      userResponse.length > 0 &&
                      quizData.current.quizTracks[activeTrackIndex.current - 1]
                        .album.images[0].url
                    }
                    isZoomed
                  />
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-1 flex-col px-3 w-full space-y-1">
              <Card
                classNames={{
                  base: " flex-1 text-mobile-3 sm:text-sm-screen-2 font-medium mt-2 sm:mt-0",
                  body: artistIsCorrect.current ? " bg-primary" : " bg-danger",
                  header: artistIsCorrect.current
                    ? " bg-primary"
                    : " bg-danger",
                }}
              >
                <CardHeader>
                  Artist:{" "}
                  {userResponse.length > 0 &&
                    quizData.current.quizTracks[activeTrackIndex.current - 1]
                      .artist[0].name}
                </CardHeader>
                <CardBody className="flex flex-1">
                  {artistIsCorrect.current ? (
                    <CorrectIcon />
                  ) : (
                    <IncorrectIcon />
                  )}
                </CardBody>
              </Card>
              <Card
                classNames={{
                  base: " flex-1 text-mobile-3 sm:text-sm-screen-2 font-medium",
                  body: trackIsCorrect.current ? " bg-primary" : " bg-danger",
                  header: trackIsCorrect.current ? " bg-primary" : " bg-danger",
                }}
              >
                <CardHeader>
                  Track:{" "}
                  {userResponse.length > 0 &&
                    quizData.current.quizTracks[activeTrackIndex.current - 1]
                      .track.name}
                </CardHeader>
                <CardBody className="flex flex-1">
                  {trackIsCorrect.current ? <CorrectIcon /> : <IncorrectIcon />}
                </CardBody>
              </Card>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="success"
              fullWidth
              onPress={handleModalOnClick}
              className=" font-medium"
            >
              {userResponse.length > 0 &&
              userResponse.length < quizData.current.quizTracks.length
                ? "Next Track"
                : "See Results"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className=" flex flex-col justify-center space-y-10 m-auto mb-2 md:w-2/3">
        {playlistTracksData && (
          <>
            <motion.div
              className=" flex p-10 justify-center space-x-5"
              key={activeTrackIndex.current + 1}
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {/* show current track number as long as there's tracks left */}
              {activeTrackIndex.current + 1 <=
                quizData.current?.quizTracks?.length && (
                <Chip
                  size="lg"
                  classNames={{
                    content: " font-medium text-mobile-3 md:text-sm-screen-2",
                  }}
                >
                  Track No: {activeTrackIndex.current + 1}
                </Chip>
              )}
              {/* only render timer if it's not on easy mode and if the quiz is in play with time on the clock */}
              {quizData.current.difficulty !== "easy" &&
                (!timerIsFinished ? (
                  <CountdownTimer
                    maxTimeLimit={
                      quizData.current.difficulty === "medium" ? 60 : 30
                    }
                    /* maxTimeLimit changes depending if difficulty is medium or hard. Configured in this ternary statement */
                    setTimerIsFinished={setTimerIsFinished}
                    handleTimerIsFinished={handleTimerIsFinished}
                  />
                ) : null)}
            </motion.div>

            <motion.div
              key={userResponse}
              className="flex-col mx-2 p-10 space-y-2 justify-center border-medium border-foreground rounded-md"
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <AnswerSelection
                activeTrackIndex={activeTrackIndex}
                setUserResponse={setUserResponse}
                artistIsCorrect={artistIsCorrect}
                trackIsCorrect={trackIsCorrect}
                setTimerIsFinished={setTimerIsFinished}
              />
            </motion.div>

            <motion.div
              key={
                userResponse.length > 0 &&
                quizData.current.quizTracks[activeTrackIndex.current]?.track?.id
              }
              className="flex-col mx-2 justify-center"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <PlayerControl
                activeTrackIndex={activeTrackIndex}
                timerIsFinished={timerIsFinished}
              />
            </motion.div>
          </>
        )}
      </div>
    </>
  );
}
