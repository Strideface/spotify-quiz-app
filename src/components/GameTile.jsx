import { useOutletContext } from "react-router-dom";

export default function GameTile({ title, description }) {
  const { setQuizStage, isAuthenticated } = useOutletContext();

  const handleOnClick = () => {
  // render selectPlaylistStage component in MainPage if authenticated user presses game tile
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: false,
      selectPlaylistStage: true,
    }));
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
