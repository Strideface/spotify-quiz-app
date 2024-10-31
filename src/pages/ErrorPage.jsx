import { useRouteError } from "react-router-dom";
import { Card, CardBody } from "@nextui-org/card";
import NavBar from "../components/NavBar";

export default function ErrorPage() {
  const error = useRouteError();
  // eslint-disable-next-line no-console
  console.log(error);
  return (
    <>
    <NavBar />
      <div className="flex-col p-10 justify-center  ">
        <Card classNames={{ base: " m-auto sm:w-3/4", body: " space-y-10" }}>
          <CardBody>
            <h1 className=" flex justify-center text-mobile-big sm:text-sm-screen-big">
              Sorry, an error occured!
            </h1>
            <p className=" flex justify-center text-mobile-3 sm:text-sm-screen-2">
              {error.statusText}
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
