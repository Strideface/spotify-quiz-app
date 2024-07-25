import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

export default function PlaylistCard({
  name,
  playlistTracksHref,
  totalTracks,
  image,
  setPlaylistSelected,
}) {
  const { quizData } = useOutletContext();

  const handleOnClick = (playlistTracksHref) => {
    quizData.current.playlistTracksHref = playlistTracksHref;
    quizData.current.playlistTotalTracks = totalTracks;
    setPlaylistSelected(true);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card
        isPressable
        onPress={() => handleOnClick(playlistTracksHref)}
        classNames={{
          base: "flex-none border py-4 w-80 bg-foreground text-default",
          body: "overflow-visible py-2",
        }}
      >
        <CardHeader className="pb-0 pt-2 px-4 w-80 flex-col items-start">
          <h4 className="font-bold text-primary truncate">{name}</h4>
          <small className="text-default-500">
            {totalTracks > 1 ? totalTracks + " tracks" : totalTracks + " track"}
          </small>
        </CardHeader>
        <CardBody>
          <Image
            alt="Playlist Cover Image"
            className="object-cover rounded-xl"
            src={image.url}
            width={300}
            height={300}
          />
        </CardBody>
      </Card>
    </motion.div>

    // <div className="flex flex-none w-playlist-card border m-5">
    //   <button
    //     className=" hover:bg-spotify-green "
    //     onClick={() => handleOnClick(playlistTracksHref)}
    //   >
    //     <h1>{name}</h1>
    //     <p>{totalTracks}</p>
    //     <img src={image.url} alt="playlist" width={300} height={300} />
    //     {/* see 'user playlist images in https://developer.spotify.com/documentation/web-api/concepts/playlists for different sizes of playlist images.
    //     I've set a standard 300 x 300 */}
    //   </button>
    // </div>
  );
}
