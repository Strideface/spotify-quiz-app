import { useState } from "react";
import Quiz from "./Quiz";
import PreQuizModal from "./PreQuizModal";

export default function CompeteQuiz() {
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
