import { useOutletContext } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import SignInButton from "./SignInButton.jsx";
import { setLocalAuthCode } from "../../../../util/authentication.js";
import {
  fetchAccessToken,
  fetchUserDetails,
} from "../../../../util/spotify-api.js";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { Avatar } from "@nextui-org/avatar";
import Alert from "../../../Alert.jsx";

export default function Authentication() {
  const queryClient = useQueryClient();

  const { isAuthenticated, setIsAuthenticated, quizData } = useOutletContext();

  const [searchParams, setSearchParams] = useSearchParams();
  let currentParams = Object.fromEntries([...searchParams]);
  let authError = useRef(null);

  // set the current url to state and use effect to monitor any changes.
  // handle if query is either 'code' or 'error' from the Spotify auth process.
  // idea from: https://ultimatecourses.com/blog/query-strings-search-params-react-router

  // FUNCTIONS
  // set up functions to call Spotify API
  // disabled auto refetching and the 'enabled' prop so it doesn't fire upon rendering of component
  const {
    data: accessData,
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
    queryKey: ["fetchUserDetails", [accessData]],
    // accessData returns the access_token. This is only being used here as a unique key so that if another user signs in,
    // a new query will be fetched and not any previously cached query (else the previous user's details will surface)
    // this requirement relates to queryClient.clear() called in one of the useEffects;
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
      // eslint-disable-next-line no-console
      console.log(`authError = ${authError.current}`); // For error logging
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
      setIsAuthenticated(true);
    }
  }, [accessIsSuccess, setIsAuthenticated]);

  useEffect(() => {
    // if user details data is present as a result of authentication in previous useEffect code,
    // create an authError if user is not premium and deny access, else store details and continue.
    if (userIsSuccess) {
      if (userData.product === "premium") {
        quizData.current.userDetails.name = userData.display_name;
        quizData.current.userDetails.country = userData.country;
        quizData.current.userDetails.userId = userData.id;
        try {
          quizData.current.userDetails.image = userData.images[0].url;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`No profile image found - ${error.message}`);
        }
      } else {
        // need to clear cache used by tanstack query so that if a different user signs in immediately after,
        // it will be forced to get new data, not old from cache stored after the initial fetch.
        queryClient.clear();
        authError.current = "Sorry, this app is only for Spotify Premium users";
        setIsAuthenticated(false);
      }
    }
  }, [queryClient, quizData, setIsAuthenticated, userData, userIsSuccess]);

  return (
    <div className=" flex min-w-72">
      <Card
        fullWidth
        classNames={{
          base: " bg-foreground text-primary hover:text-spotify-green-2",
          body: " text-center",
          header: "justify-center text-foreground hover:text-spotify-green-2",
        }}
      >
        {isAuthenticated && (
          <CardHeader>
            {userIsLoading && <Spinner />}
            {userData && (
              <Avatar
                src={userData?.images[0]?.url}
                alt="user profile image"
                showFallback
                color="primary"
                size="lg"
                isBordered
                radius="sm"
              />
            )}
          </CardHeader>
        )}
        <CardBody className=" font-medium gap-4 justify-center text-mobile-3 sm:text-sm-screen-2">
          {accessIsError && (
            <Alert message={accessError.message} color="primary" />
          )}
          {/* only show auth error if it has a current value. Clears when auth is a success. */}
          {authError.current && (
            <Alert message={authError.current} color="primary" />
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
