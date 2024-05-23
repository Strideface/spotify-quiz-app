import { useOutletContext } from "react-router-dom";
import SearchPlaylists from "../SearchPlaylists";
import UserPlaylists from "../UserPlaylists";
import Modal from "../Modal";
import { useRef, useState } from "react";

export default function SelectPlaylistStage() {
  const { isAuthenticated, setQuizStage } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const setDifficultyModal = useRef();

  if (!isAuthenticated) {
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: true,
      selectPlaylistStage: false,
    }));
  }

  if (showModal) {
    setDifficultyModal.current.open();
  }

  const handleOnSubmit = () => {
    setShowModal(false);
    console.log("form submitted");
    // what type of data should be created when playlistCard is clicked (playlistTracksItems)?
  };
  const handleOnClose = () => setShowModal(false);

  // continue watching https://www.udemy.com/course/react-the-complete-guide-incl-redux/learn/lecture/39836354#questions/21203546/
  return (
    <>
      <Modal
        onClose={handleOnClose}
        onSubmit={handleOnSubmit}
        ref={setDifficultyModal}
        title="Select Difficulty"
        message="Choose the difficulty level of the quiz"
      >
        <input type="checkbox" id="easy" name="easy" value="Easy" />
        <label for="easy">Easy</label>
        <br />
        <input type="checkbox" id="medium" name="medium" value="Medium" />
        <label for="medium">Medium</label>
        <br />
        <input type="checkbox" id="hard" name="hard" value="Hard" />
        <label for="hard">Hard</label>
        <br />
      </Modal>
{/* to review: not a fan of prop drilling with setShowModal through 3 or 4 components. Find a better way! */}
      <SearchPlaylists setShowModal={setShowModal} />
      <UserPlaylists setShowModal={setShowModal} />
    </>
  );
}
