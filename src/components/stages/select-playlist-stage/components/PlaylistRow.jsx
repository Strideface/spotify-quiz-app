import { useOutletContext } from "react-router-dom";
import PlaylistCard from "./PlaylistCard";

export default function PlaylistRow({ playlistData, setPlaylistSelected }) {
  const { quizData } = useOutletContext();
  return (
    <div className=" flex overflow-auto p-5 gap-5 scroll">
      {playlistData.map((item) => (
        <PlaylistCard
          key={item.id}
          id={item.id}
          name={item.name}
          totalTracks={item.tracks.total}
          image={item.images[0]}
          genre={item.description}
          setPlaylistSelected={setPlaylistSelected}
        />
      ))}
    </div>
  );
}
