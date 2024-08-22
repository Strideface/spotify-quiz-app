import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/tooltip";

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
        shadow="lg"
        onPress={() => handleOnClick(playlistTracksHref)}
        classNames={{
          base: "flex-none border py-3 w-60 sm:w-80 sm:h-96 bg-foreground text-default",
          body: "overflow-visible py-1 ",
        }}
      >
        <CardHeader className="pb-0 pt-1 px-3 w-60 sm:w-80 flex-col items-start">
          <Tooltip content={name} delay={1000}>
          <h4 className=" text-mobile-2 sm:text-sm-screen-1 font-bold text-primary truncate">{name}</h4>
          </Tooltip>
          <p className=" text-mobile-1 sm:text-sm text-default-500">
            {totalTracks > 1 ? totalTracks + " tracks" : totalTracks + " track"}
          </p>
        </CardHeader>
        <CardBody>
          <Image
            alt="Playlist Cover Image"
            className="object-cover rounded-xl aspect-square"
            src={image.url}
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
