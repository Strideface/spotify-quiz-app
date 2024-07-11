import { useOutletContext } from "react-router-dom";
import SearchPlaylists from "./components/SearchPlaylists";
import UserPlaylists from "./components/UserPlaylists";
import Modal from "../../Modal";
import { useEffect, useRef, useState } from "react";

export default function SelectPlaylistStage() {
  const { isAuthenticated, setQuizStage, quizData } = useOutletContext();
  const [playlistSelected, setPlaylistSelected] = useState(false);
  // refs to connect with elements
  const settingsModal = useRef();
  const easy = useRef();
  const medium = useRef();
  const hard = useRef();
  const quantity = useRef();

  if (!isAuthenticated) {
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: true,
      selectPlaylistStage: false,
    }));
  }

  useEffect(() => {
    if (playlistSelected) {
      settingsModal.current.open();
    }
  }, [playlistSelected]);

  const handleOnSubmit = (event) => {
    event.preventDefault(); // prevents form submission to server
    // assign selected total tracks for quiz
    quizData.current.quizTotalTracks = quantity.current.value
    // assign selected difficulty level
    if (easy.current.checked) {
      quizData.current.difficulty = easy.current.value;
    } else if (medium.current.checked) {
      quizData.current.difficulty = medium.current.value;
    } else if (hard.current.checked) {
      quizData.current.difficulty = hard.current.value;
    }

    settingsModal.current.close();

    setQuizStage((prevState) => ({
      ...prevState,
      selectPlaylistStage: false,
      playQuizStage: true,
    }));
  };

  const handleOnClose = () => {
    settingsModal.current.close();
    setPlaylistSelected(false);
  };

  return (
    <>
      <Modal
        ref={settingsModal}
        title="Quiz Settings"
        message="Select preferences or leave as it is"
      >
        <div className=" flex p-5 justify-center space-y-2">
          <form method="dialog" onSubmit={handleOnSubmit}>
            <div>
              <label for="quantity">Number of tracks : </label>
              <input
                ref={quantity}
                type="number"
                id="quantity"
                name="quantity"
                defaultValue={
                  quizData.current.playlistTotalTracks &&
                  quizData.current.playlistTotalTracks.toString()
                }
                min="1"
                max={
                  quizData.current.playlistTotalTracks &&
                  quizData.current.playlistTotalTracks.toString()
                }
              />
            </div>
            <h2>Choose the difficulty level of the quiz</h2>
            <input
              ref={easy}
              type="radio"
              id="easy"
              name="difficulty"
              value="easy"
            />
            <label htmlFor="easy">Easy</label>
            <br />
            <input
              ref={medium}
              type="radio"
              id="medium"
              name="difficulty"
              value="medium"
              checked="readOnly"
            />
            <label htmlFor="medium">Medium</label>
            <br />
            <input
              ref={hard}
              type="radio"
              id="hard"
              name="difficulty"
              value="hard"
            />
            <label htmlFor="hard">Hard</label>
            <br />

            <button type="reset" onClick={handleOnClose}>
              Cancel
            </button>
            <button type="submit">Confirm</button>
          </form>
        </div>
      </Modal>

      <SearchPlaylists setPlaylistSelected={setPlaylistSelected} />
      <UserPlaylists setPlaylistSelected={setPlaylistSelected} />
    </>
  );
}
