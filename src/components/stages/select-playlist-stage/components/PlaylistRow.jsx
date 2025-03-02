import PlaylistCard from "./PlaylistCard";

export default function PlaylistRow({ playlistData, setPlaylistSelected }) {
  return (
    <div className=" flex overflow-auto p-5 gap-5 scroll">
      {playlistData.map((item) => (
        <PlaylistCard
          key={item.id}
          id={item.id}
          name={item.name}
          totalTracks={item.tracks.total}
          image={item.images ? item.images[0] : null}
          genre={item.description}
          setPlaylistSelected={setPlaylistSelected}
        />
      ))}
    </div>
  );
}
