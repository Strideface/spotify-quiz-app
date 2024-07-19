import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  return (
    <div className=" flex flex-col p-10 justify-center space-y-10">
      <h1>An error occured!</h1>
      <p>{error.statusText}</p>
    </div>
  );
}
