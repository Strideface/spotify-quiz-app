import { Card, CardBody } from "@nextui-org/card";

export default function CompeteQuiz() {
  // Render Quiz component here after setting up a prior component, which renders after selecting the game tile,
  // allowing the user to select a playlist (these will be pre-made playlists relating to different genres) and thus
  // Quiz will get the appropriate playlistHref

  return (
    <div className="flex-col p-10 justify-center  ">
      <Card classNames={{ base: " m-auto sm:w-3/4", body: " space-y-10" }}>
        <CardBody>
          <h1 className=" flex justify-center text-mobile-big sm:text-sm-screen-big">
            Compete, coming soon...
          </h1>
        </CardBody>
      </Card>
    </div>
  );
}
