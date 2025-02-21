import { useState } from "react";
import Quiz from "./Quiz";
import PreQuizModal from "./PreQuizModal";

// present an introductory modal when component is rendered initially that explains how to play.
// Rules change depending on selected difficulty
// closes once 'Play' button is presed

export default function IntrosQuiz() {
  const [inPlay, setInPlay] = useState(false);
  const [tracksReady, setTracksReady] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div>
      <PreQuizModal
        inPlay={inPlay}
        setInPlay={setInPlay}
        tracksReady={tracksReady}
        error={error}
      />

      <Quiz
        inPlay={inPlay}
        setTracksReady={setTracksReady}
        setError={setError}
      />
    </div>
  );
}
