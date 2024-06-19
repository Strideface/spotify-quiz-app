import { useOutletContext } from "react-router-dom";
import SearchPlaylists from "./components/SearchPlaylists";
import UserPlaylists from "./components/UserPlaylists";
import Modal from "../../Modal";
import { useRef } from "react";

export default function SelectPlaylistStage() {
  const { isAuthenticated, setQuizStage, showModal, setShowModal, quizData } =
    useOutletContext();
  // refs to connect with elements
  const selectDifficultyModal = useRef();
  const easy = useRef();
  const medium = useRef();
  const hard = useRef();

  if (!isAuthenticated) {
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: true,
      selectPlaylistStage: false,
    }));
  }

  if (showModal.selectDifficultyModal) {
    selectDifficultyModal.current.open();
  }
  

  const handleOnSubmit = (event) => {
    event.preventDefault(); // prevents form submission to server

    // assign selected difficulty level
    if (easy.current.checked) {
      quizData.current.difficulty = easy.current.value;
    } else if (medium.current.checked) {
      quizData.current.difficulty = medium.current.value;
    } else if (hard.current.checked) {
      quizData.current.difficulty = hard.current.value;
    }

    selectDifficultyModal.current.close();

    setShowModal((prevState) => ({
      ...prevState,
      selectDifficultyModal: false,
    }));

    setQuizStage((prevState) => ({
      ...prevState,
      selectPlaylistStage: false,
      playQuizStage: true,
    }));
  };

  const handleOnClose = () => {
    selectDifficultyModal.current.close();
    setShowModal((prevState) => ({
      ...prevState,
      selectDifficultyModal: false,
    }));
  };

  return (
    <>
      <Modal
        ref={selectDifficultyModal}
        title="Select Difficulty"
        message="Choose the difficulty level of the quiz"
      >
        <div className=" flex p-5 justify-center space-y-2">
        <form method="dialog" onSubmit={handleOnSubmit}>
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

      <SearchPlaylists />
      <UserPlaylists />
    </>
  );
}
