import { Link } from "react-router-dom";

export default function NavBar({ quizStage }) {
  return (
    <nav className="">
      {/* Don't show the leaderboard link option if at the quiz stage of the app, as clicking away and returning causes errors*/}
      {quizStage && !quizStage.playQuizStage && (
        <p>
          <Link to="/leaderboard">Leaderboard</Link>
        </p>
      )}

      <p>
        <Link to="/">Main Page</Link>
      </p>
    </nav>
  );
}
