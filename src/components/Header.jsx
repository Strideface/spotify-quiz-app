import NavBar from "./NavBar";

export default function Header({ quizStage }) {
  return (
    <header className=" flex flex-row place-content-between p-20 bg-spotify-green">
      <h2 className=" ">Placeholder</h2>
      <h1 className=" text-spotify-black">Spotify Quiz App</h1>

      <NavBar quizStage={quizStage && quizStage} />
    </header>
  );
}
