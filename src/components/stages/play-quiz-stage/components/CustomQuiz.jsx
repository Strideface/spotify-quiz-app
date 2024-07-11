import { useRef, useEffect, useState } from "react";
import Quiz from "./Quiz";
import Modal from "../../../Modal";
import { useOutletContext } from "react-router-dom";
import LoadingIndicator from "../../../LoadingIndicator";

// present an introductory modal when component is rendered initially that explains how to play.
// Rules change depending on selected difficulty
// closes once button is presed

export default function CustomQuiz() {
  const { quizData } = useOutletContext();
  const rulesModal = useRef();
  const [inPlay, setInPlay] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [tracksReady, setTracksReady] = useState(false);

  // only open this modal upon initialization, once
  useEffect(() => {
    rulesModal.current.open();
  }, []);

  const easy = (
    <ul>
      <li>Difficuly Selected: Easy</li>
      <li>Time Limt per track: Unlimited</li>
      <li>Repeat track limit: Unlimited</li>
      <li>The whole track will play from the start</li>
    </ul>
  );

  const medium = (
    <ul>
      <li>Difficuly Selected: Medium</li>
      <li>Time Limt per track: 30 seconds</li>
      <li>Repeat track from start limit: Unlimited</li>
      <li>A 30 second preview of the track can be played</li>
    </ul>
  );

  const hard = (
    <ul>
      <li>Difficuly Selected: Hard</li>
      <li>Time Limt per track: 30 seconds</li>
      <li>Repeat track from start limit: Unlimited</li>
      <li>A 10 second intro of the track can be played</li>
    </ul>
  );

  const handleOnClick = () => {
    rulesModal.current.close();
    setInPlay(true);
  };

  return (
    <>
      <h1>Custom Quiz</h1>
      <Modal
        ref={rulesModal}
        title="Custom Quiz Rules"
        message="Before starting the quiz, please check how to play and the rules"
      >
        <div className="flex flex-col justify-center space-x-2">
          <ul>
            <li>
              Identify the artist of the track first by searching the name and
              then selecting an option.
            </li>
            <li>
              Pick the track by selecting an option from the next dropdown
              selection field.
            </li>
            <li>
              Submit your answer or Skip if you don't know (An Artist and Track
              must be selected to submit an answer).
            </li>
          </ul>
          <h2>Rules:</h2>
          {quizData.current.difficulty === "easy" && easy}
          {quizData.current.difficulty === "medium" && medium}
          {quizData.current.difficulty === "hard" && hard}
        </div>
        <div className="flex flex-col justify-center space-x-2">
          <p>The quiz will start as soon as you hit 'Play'!</p>
          {tracksReady ? (
            <button type="button" onClick={handleOnClick}>
              Play
            </button>
          ) : (
            <LoadingIndicator loadingMessage="Preparing Tracks..."/>
          )}
        </div>
      </Modal>
      <Quiz inPlay={inPlay} setTracksReady={setTracksReady}/>
    </>
  );
}
