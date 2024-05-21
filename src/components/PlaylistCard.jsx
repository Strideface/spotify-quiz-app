import { fetchPlaylistTracks } from "../util/spotify-api";

export default function PlaylistCard({ name, tracks, totalTracks, image }) {
  const handleOnClick = (playlistTracksHref) =>
    fetchPlaylistTracks(playlistTracksHref);

  return (
    <div className="flex flex-none w-playlist-card border m-5">
      <button
        className=" hover:bg-spotify-green "
        onClick={() => handleOnClick(tracks)}
      >
        <h1>{name}</h1>
        <p>{totalTracks}</p>
        <img src={image.url} alt="playlist" width={300} height={300} />
        {/* see 'user playlist images in https://developer.spotify.com/documentation/web-api/concepts/playlists for different sizes of playlist images. 
        I've set a standard 300 x 300 */}
      </button>
    </div>
  );
}
