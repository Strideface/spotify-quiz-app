import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/tooltip";
import spotifyIcon from "../../../../images/Spotify_Icon_RGB_Green.png";

export default function PlaylistCard({
  id,
  name,
  totalTracks,
  image,
  genre,
  setPlaylistSelected,
}) {
  const { quizData } = useOutletContext();

  const handleOnClick = (id) => {
    quizData.current.playlist.playlistTotalTracks = totalTracks;
    quizData.current.playlist.name = name;
    quizData.current.playlist.id = id;
    quizData.current.playlist.genre = genre;
    setPlaylistSelected(true);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card
        isPressable
        shadow="lg"
        onPress={() => handleOnClick(id)}
        classNames={{
          base: "flex-none border py-3 w-60 sm:w-80 sm:h-96 bg-foreground text-default",
          body: "overflow-visible py-1 ",
        }}
      >
        <CardHeader className="pb-0 pt-1 px-3 w-60 sm:w-80 flex-col items-start">
          <Tooltip content={name} delay={1000}>
            <h4 className=" text-mobile-2 sm:text-sm-screen-1 font-bold text-primary truncate">
              {name}
            </h4>
          </Tooltip>
          <p className=" text-mobile-1 sm:text-sm text-default-500">
            {totalTracks > 1 ? totalTracks + " tracks" : totalTracks + " track"}
          </p>
        </CardHeader>
        <CardBody>
          <Image
            alt="Playlist Cover Image"
            className="object-cover rounded-xl aspect-square"
            src={image ? image.url : spotifyIcon}
          />
        </CardBody>
      </Card>
    </motion.div>
  );
}
