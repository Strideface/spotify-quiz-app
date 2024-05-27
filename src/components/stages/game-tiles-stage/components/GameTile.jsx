import { useOutletContext } from "react-router-dom";

export default function GameTile({ title, description, gameId }) {
  const { setQuizStage, isAuthenticated, quizData } = useOutletContext();

  const handleOnClick = () => {
    quizData.current.gameId = gameId;

    // else if because may want to add more games at a later point.
    if (quizData.current.gameId === "CUSTOM") {
      setQuizStage((prevState) => ({
        ...prevState,
        gameTilesStage: false,
        selectPlaylistStage: true,
      }));
    } else if (quizData.current.gameId === "COMPETE") {
      setQuizStage((prevState) => ({
        ...prevState,
        gameTilesStage: false,
        playQuizStage: true,
      }));
    }
  };

  const authenticatedButton = (
    <button className=" hover:bg-spotify-green" onClick={handleOnClick}>
      <div className=" flex-auto border">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </button>
  );

  const unauthenticatedButton = (
    <button>
      <div className=" flex-auto border">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </button>
  );

  if (isAuthenticated) {
    return authenticatedButton;
  } else {
    return unauthenticatedButton;
  }
}
