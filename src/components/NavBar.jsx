import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="">
      <p><Link to="/leaderboard">Leaderboard</Link></p>
      <p><Link to="/">Main Page</Link></p>
    </nav>
  );
}
