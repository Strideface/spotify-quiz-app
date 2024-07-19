import { Link as RouterLink } from "react-router-dom"; // to distinguish between Link from react router and Link from NextUI,navbar
// I'm using react router so I need to make use of its Link and 'to' attribute so as to re-route from one URL to another
import {
  Navbar as NextuiNavBar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import icon from "../images/Spotify_Icon_RGB_Green.png";

export default function NavBar({ quizStage }) {
  return (
    <NextuiNavBar
      isBordered
      height="12rem"
      maxWidth="full"
      classNames={{ base: " bg-spotify-black " }}
    >
      <NavbarBrand>
        <img src={icon} alt="" className=" w-1/6 h-1/6" />
      </NavbarBrand>
      <NavbarContent justify="center">
        <h1 className=" text-spotify-green text-large">Spotify Quiz App</h1>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {/* Don't show the leaderboard link option if at the quiz stage of the app, as clicking away and returning causes errors*/}
        {quizStage && !quizStage.playQuizStage && (
          <NavbarItem>
            <RouterLink to="/leaderboard">
              <h2 className=" text-spotify-white">Leaderboard</h2>
            </RouterLink>
          </NavbarItem>
        )}
        <NavbarItem>
          <RouterLink to="/">
            <h2 className=" text-spotify-white">Main Page</h2>
          </RouterLink>
        </NavbarItem>
      </NavbarContent>
    </NextuiNavBar>
  );
}

// {/* <nav className="">
//       {/* Don't show the leaderboard link option if at the quiz stage of the app, as clicking away and returning causes errors*/}
//       {quizStage && !quizStage.playQuizStage && (
//         <p>
//           <RouterLink to="/leaderboard">Leaderboard</RouterLink>
//         </p>
//       )}

//       <p>
//         <RouterLink to="/">Main Page</RouterLink>
//       </p>
//     </nav> */}
