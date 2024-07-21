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
      height="20rem"
      maxWidth="full"
      position="static"
      classNames={{ base: " sm:h-48 bg-spotify-black py-6", wrapper: " flex-col sm:flex-row", brand: " flex-none" }}
    >
      <NavbarContent justify="center">
      <NavbarBrand>
        <img src={icon} alt="" className=" w-24 h-24" />
      </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center">
        <h1 className=" text-spotify-green text-5xl">Spotify Quiz App</h1>
      </NavbarContent>
      <NavbarContent className=" flex-col" justify="center">
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
