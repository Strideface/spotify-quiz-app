import { useOutletContext } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import SignInButton from "../components/SignInButton";
import { setLocalAuthCode, checkAuth } from "../util/authentication.js";
import { fetchAccessToken, fetchUserDetails } from "../util/spotify-api.js";

export default function Authentication() {
  // STATE
  const { isAuthenticated, setIsAuthenticated } = useOutletContext();

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
    isFetching: userIsFetching,
    refetch: userRefetch,
  } = useQuery({
    queryKey: ["fetchUserDetails"],
    queryFn: () => fetchUserDetails(),
    staleTime: Infinity, // Only get user details once. Data is never considered old so no auto refetches.
    enabled: false,
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
    }
  }, [accessRefetch, currentParams.code, currentParams.error, searchParams, setSearchParams]);

  useEffect(() => {
    // fetch user details if fetchAccessToken is a success. Only runs one time after sign in
    // set isAuthenticated to true
    if (accessIsSuccess) {
      setIsAuthenticated(checkAuth());
      userRefetch(); 
      // console.log("userRefetch from accessIsSuccess")
      // also fetch user details if user remains authenticated and has not just signed in.
      // handles case where user might refresh browser
    } else if (isAuthenticated) {
      userRefetch();
      // console.log("userRefetch from isAuthenticated")
    }
  }, [accessIsSuccess, isAuthenticated, setIsAuthenticated, userRefetch]);

  return (
    <div>
      {accessIsFetching && <p>Authenticating...</p>}
      {accessIsError && <p>An error has occured: {accessError.message}</p>}
      {/* only show auth error if it has a current value. Clears when auth is a success. */}
      {authError.current && (
        <p>
          Error: {authError.current} - It looks like you did not give authorization, or there was an error.
          Please try again.
        </p>
      )}
      {/* show display name (if available) if authenticated else show sign in button */}
      {isAuthenticated ? (
        <p>Let's play {userIsFetching ? "..." : userData?.display_name}</p>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
