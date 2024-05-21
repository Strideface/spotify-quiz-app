import { useOutletContext } from "react-router-dom";
import SearchPlaylists from "../SearchPlaylists";
import UserPlaylists from "../UserPlaylists";

export default function SelectPlaylistStage() {
  const { isAuthenticated, setQuizStage } = useOutletContext();

  if (!isAuthenticated) {
    setQuizStage((prevState) => ({
      ...prevState,
      gameTilesStage: true,
      selectPlaylistStage: false,
    }));
  }

  return (
    <>
    {/* <h1 className=" flex p-10 justify-center">Search Playlists</h1> */}
      <SearchPlaylists />
      <UserPlaylists />
    </>
  );
}
