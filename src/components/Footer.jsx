import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import GithubIcon from "../images/GitHubIcon";

// Don't show a footer if in the play quiz or final results stages because it may obscure the player control and/or the 'play again' button.
// Can't tell what the height of a mobile device could be.
export default function Footer({ quizStage }) {
  return (quizStage && quizStage.playQuizStage) ||
    quizStage.finalResultsStage ? null : (
    <footer className=" w-full fixed inset-x-0 bottom-0 px-2 bg-foreground">
      <div className=" flex justify-between">
        <div className=" flex items-center">
          <p className=" text-default-500 text-mobile-1 sm:text-sm-screen-1">
            created by Strideface
          </p>
        </div>
        <div className=" flex items-center">
          <Button
            href="https://github.com/Strideface/spotify-quiz-app/"
            isIconOnly
            as={Link}
            isExternal
            showAnchorIcon
            className=" m-1 w-14 sm:w-20"
          >
            <GithubIcon />
          </Button>
        </div>
      </div>
    </footer>
  );
}
