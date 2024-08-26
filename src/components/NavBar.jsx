import { Outlet, Link as RouterLink } from "react-router-dom"; // to distinguish between Link from react router and Link from NextUI,navbar
// I'm using react router so I need to make use of its Link and 'to' attribute so as to re-route from one URL to another
import {
  Navbar as NextuiNavBar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { useLocation } from "react-router-dom";

import logo from "../images/Spotify_Logo_RGB_Green.png";
import icon from "../images/Spotify_Icon_RGB_Green.png";
import { Image } from "@nextui-org/image";

export default function NavBar({ quizStage }) {
  // used to get current URL path name which will help set the isActive prop on each NavbarItem
  let location = useLocation();

  return (
    <>
      <NextuiNavBar
        maxWidth="full"
        position="static"
        classNames={{
          base: " bg-spotify-black text-secondary h-32 sm:h-24 ",
          wrapper: " px-8 gap-2 flex-col sm:flex-row h-24 sm:h-20 ",
          brand: " flex-row sm:flex-col sm:items-start",
          // NEED TO FIX HEIGHT OF ITEMS SO THAT UNDERLINE IS ALWAYS DIRECTLY BELOW THE ITEMS. TO DO WITH H-FULL AND STRETCHING CONTENT OVER ITS CONTAINING ELEMENT.
          item: [
            "flex",
            "relative",
            "h-fit", 
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[2px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-primary",
          ],
        }}
      >
        {/* show this brand config from small screens to larger */}
        {/* <NavbarContent justify="center" className=" hidden sm:block"> */}
          <NavbarBrand className=" hidden sm:block">
            <p className=" text-primary font-semibold mb-2">Powered by</p>
            <Image src={logo} alt="Spotify Logo" width={110} />
          </NavbarBrand>
        {/* </NavbarContent> */}

        <NavbarContent justify="center" className=" h-fit sm:h-full">
          <h1 className=" text-spotify-green text-center font-semibold text-xl sm:text-3xl ">
            Spotify Quiz App
          </h1>
        </NavbarContent>
        {/* show this brand config on mobile (less than 'sm:')*/}
        <NavbarContent justify="center" className=" h-fit sm:h-full sm:hidden">
          <NavbarBrand>
            <p className=" text-primary font-semibold mr-2 text-mobile-1 ">
              Powered by
            </p>
            <Image src={icon} alt="Spotify Icon" width={36} />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className=" h-fit items-end flex-row sm:flex-col "
          justify="end"
        >
          {/* Don't show the leaderboard link option if at the quiz stage of the app, as clicking away and returning causes errors*/}
          {quizStage && !quizStage.playQuizStage && (
            <NavbarItem isActive={location.pathname === "/leaderboard"}>
              <RouterLink to="/leaderboard">
                <h2 className=" text-mobile-2 sm:text-sm-screen-1">
                  Leaderboard
                </h2>
              </RouterLink>
            </NavbarItem>
          )}
          <NavbarItem isActive={location.pathname === "/"}>
            <RouterLink to="/" >
              <h2 className=" text-mobile-2 sm:text-sm-screen-1">Main Page</h2>
            </RouterLink>
          </NavbarItem>
        </NavbarContent>
      </NextuiNavBar>
    </>
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
