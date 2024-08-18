import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import { shuffleArray } from "../../../../util/util";
import LoadingIndicator from "../../../LoadingIndicator";
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

export default function Quiz({ inPlay, setTracksReady }) {
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
    isLoading: playlistTracksIsLoading,
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
  // the query is not caching previous results, probably due to what's in the response header
  // 'Cache-Control: public, max-age=0'

  // get quiz tracks result from fetchPlaylistTracks once available
  useEffect(() => {
    if (playlistTracksData) {
      // shuffle order of tracks before assignment
      shuffleArray(playlistTracksData);
      quizData.current.quizTracks = playlistTracksData;
      console.log(quizData.current);
      // inform parent component that quiz can be started.
      setTracksReady(true);
    }
  }, [playlistTracksData, quizData, setTracksReady]);

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

  const correctIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      class="bi bi-check-circle-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  );

  const incorrectIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      class="bi bi-file-x-fill"
      viewBox="0 0 16 16"
    >
      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M6.854 6.146 8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 1 1 .708-.708" />
    </svg>
  );

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onClose={handleModalOnClick}
        isDismissable={false}
        isKeyboardDismissDisabled
        hideCloseButton
        size="2xl"
        classNames={{
          header: " justify-center text-mobile-3 sm:text-sm-screen-2",
          body: " sm:flex-row divide-y-large sm:divide-y-0 sm:divide-x-large divide-foreground",
          // footer: " justify-center",
        }}
      >
        <ModalContent>
          <ModalHeader>Result</ModalHeader>
          <ModalBody>
            <div className=" flex justify-center">
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

            <div className=" flex-col px-3 w-full space-y-1 ">
              <Card
                classNames={{
                  base: " text-mobile-3 sm:text-sm-screen-2 font-medium h-1/2 mt-2 sm:mt-0",
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
                <CardBody>
                  {artistIsCorrect.current ? correctIcon : incorrectIcon}
                </CardBody>
              </Card>
              <Card
                classNames={{
                  base: " text-mobile-3 sm:text-sm-screen-2 font-medium h-1/2",
                  body: trackIsCorrect.current ? " bg-primary" : " bg-danger",
                  header: trackIsCorrect.current
                    ? " bg-primary"
                    : " bg-danger",
                }}
              >
                <CardHeader>
                  Track:{" "}
                  {userResponse.length > 0 &&
                    quizData.current.quizTracks[activeTrackIndex.current - 1]
                      .track.name}
                </CardHeader>
                <CardBody>
                  {artistIsCorrect.current ? correctIcon : incorrectIcon}
                </CardBody>
              </Card>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="success" fullWidth onPress={handleModalOnClick}>
              {userResponse.length > 0 &&
              userResponse.length < quizData.current.quizTracks.length
                ? "Next Track"
                : "See Results"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className=" flex flex-col justify-center space-y-10 m-auto md:w-2/3">
        {playlistTracksIsLoading && <LoadingIndicator />}
        {playlistTracksData && (
          <>
            <div className=" flex p-10 justify-center space-x-5">
              {/* show current track number as long as there's tracks left */}
              {activeTrackIndex.current + 1 <=
                quizData.current?.quizTracks?.length && (
                <Chip size="lg" classNames={{content: " font-medium text-mobile-3 md:text-sm-screen-2"}}>
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
            </div>
            <div className="flex-col mx-2 p-10 justify-center space-y-2 border-medium border-foreground rounded-md">
              <AnswerSelection
                key={activeTrackIndex.current}
                activeTrackIndex={activeTrackIndex}
                setUserResponse={setUserResponse}
                artistIsCorrect={artistIsCorrect}
                trackIsCorrect={trackIsCorrect}
                setTimerIsFinished={setTimerIsFinished}
              />
            </div>
            <div className="flex-col p-10 justify-center">
              <PlayerControl
                key={activeTrackIndex.current}
                activeTrackIndex={activeTrackIndex}
                timerIsFinished={timerIsFinished}
              />
            </div>
          </>
        )}

        {playlistTracksIsError && <p>Error: {playlistTracksError.message}</p>}
      </div>
    </>
  );
}
