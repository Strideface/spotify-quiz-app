import { useRouteError } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  return (
    <>
      <NavBar />
      <div className=" flex flex-col p-10 justify-center space-y-10">
        <h1>An error occured!</h1>
        <p>{error.statusText}</p>
      </div>
    </>
  );
}
