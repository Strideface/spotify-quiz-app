
import PlaylistCard from "./PlaylistCard";

export default function PlaylistRow({ playlistData, setPlaylistSelected }) {
  return (
    <div className=" flex overflow-auto p-5 gap-5">
      {playlistData.map((item) => (
        <PlaylistCard
          key={item.id}
          name={item.name}
          playlistTracksHref={item.tracks.href}
          totalTracks={item.tracks.total}
          image={item.images[0]}
          setPlaylistSelected={setPlaylistSelected}
        />
      ))}
    </div>
  );
}
