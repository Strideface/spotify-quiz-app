import { useOutletContext } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import SignInButton from "./SignInButton.jsx";
import {
  setLocalAuthCode,
  checkAuth,
} from "../../../../util/authentication.js";
import {
  fetchAccessToken,
  fetchUserDetails,
} from "../../../../util/spotify-api.js";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";

export default function Authentication() {
  // STATE
  const { isAuthenticated, setIsAuthenticated, quizData } = useOutletContext();

  const [searchParams, setSearchParams] = useSearchParams();
  let currentParams = Object.fromEntries([...searchParams]);
  let authError = useRef(null); //   to log if error after user auth link. Temp placeholder.

  // set the current url to state and use effect to monitor any changes.
  // handle if query is either 'code' or 'error' from the Spotify auth process.
  // idea from: https://ultimatecourses.com/blog/query-strings-search-params-react-router

  // FUNCTIONS
  // set up functions to call Spotify API
  // disabled auto refetching and 'enabled' so it doesn't fire upon rendering of component
  const {
    isFetching: accessIsFetching,
    isSuccess: accessIsSuccess,
    isError: accessIsError,
    error: accessError,
    refetch: accessRefetch,
  } = useQuery({
    queryKey: ["fetchAccessToken"],
    queryFn: () => fetchAccessToken(),
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const {
    data: userData,
    isLoading: userIsLoading,
    isSuccess: userIsSuccess,
  } = useQuery({
    queryKey: ["fetchUserDetails"],
    queryFn: () => fetchUserDetails(),
    staleTime: Infinity, // Only get user details once. Data is never considered old so no auto refetches.
    cacheTime: Infinity, // Cache user details infinitely as this is not expected to change during average usage of the app.
    // data is never collected by garbage. See: https://tanstack.com/query/v4/docs/framework/react/guides/caching
    enabled: isAuthenticated,
    // Derived. Once isAuthentication is true following 'accessIsSuccess', fetchUserDetails will run.
  });

  // SIDE EFFECTS

  useEffect(() => {
    if (currentParams.code) {
      setLocalAuthCode(currentParams.code); // required for fetching access token
      accessRefetch(); // fetch access token
      setSearchParams(""); // clear parameter from URL
    }
    if (currentParams.error) {
      authError.current = currentParams.error;
      setSearchParams("");
    }
    // clean up function resets any previous authentication error to null
    return () => {
      authError.current = null;
    };
  }, [
    accessRefetch,
    currentParams.code,
    currentParams.error,
    searchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    // If fetchAccessToken is a success, set isAuthenticated to true.
    // This effect only runs one time after sign in
    if (accessIsSuccess) {
      setIsAuthenticated(checkAuth());
    }
  }, [accessIsSuccess, setIsAuthenticated]);

  useEffect(() => {
    // if user details data is present as a result of calling userRefetch in previous useEffect code,
    // store details
    if (userIsSuccess) {
      console.log(userData);
      quizData.current.userDetails.name = userData.display_name;
      quizData.current.userDetails.country = userData.country;
      quizData.current.userDetails.image = userData.images[1].url;
    }
  }, [quizData, userData, userIsSuccess]);

  return (
    <div className=" flex sm:min-w-72">
      <Card
        fullWidth
        classNames={{
          base: " bg-foreground text-primary",
          body: " text-center",
          header: "justify-center",
        }}
      >
        {isAuthenticated && (
          <CardHeader>
            <Avatar
              src={userData ? userData?.images[1].url : ""}
              showFallback
              size="lg"
              isBordered
              color="primary"
            />
          </CardHeader>
        )}
        <CardBody className=" font-medium gap-4 justify-center text-mobile-3 sm:text-sm-screen-2">
          {accessIsError && (
            <p className=" text-mobile-1 sm:text-sm-screen-1">
              An error has occured: {accessError.message}
            </p>
          )}
          {/* only show auth error if it has a current value. Clears when auth is a success. */}
          {authError.current && (
            <p className=" text-mobile-1 sm:text-sm-screen-1">
              It looks like you did not give authorization, or there was an
              error. Please try again.
            </p>
          )}
          {/* show display name (if available - might be null) if authenticated else show sign in button */}
          {isAuthenticated ? (
            <p>
              Let's Play{userIsLoading && "..."}
              {userData && ", " + userData?.display_name + "!"}
            </p>
          ) : (
            <SignInButton isLoading={accessIsFetching} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
