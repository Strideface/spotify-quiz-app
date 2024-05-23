import PlaylistCard from "./PlaylistCard";

export default function PlaylistRow({ playlistData, setShowModal }) {
  return (
    <div className=" flex flex-nowrap overflow-auto ">
      {playlistData.map((item) => (
        <PlaylistCard
          key={item.id}
          name={item.name}
          tracks={item.tracks.href}
          totalTracks={item.tracks.total}
          image={item.images[0]}
          setShowModal={setShowModal}
        />
      ))}
    </div>
  );
}
