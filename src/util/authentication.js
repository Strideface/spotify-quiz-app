// functions to set and get Spotify's code and tokens on local storage so they can be retrieved.
// and functions to manage expiration of token
import { fetchRefreshToken } from "./spotify-api";

const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

export const setExpirationTimestamp = () => {
  const dateObj = new Date(Date.now() + EXPIRATION_TIME).getTime(); // add 1 hour to current time
  localStorage.setItem("spotify_expiration_timestamp", dateObj);
};

export const getExpirationTimestamp = () =>
  localStorage.getItem("spotify_expiration_timestamp");

export const setLocalAuthCode = (authCode) => {
  localStorage.setItem("spotify_auth_code", authCode);
  // to do: handle a 'QuotaExceededError'
};

export const getLocalAuthCode = () => localStorage.getItem("spotify_auth_code");

export const setLocalAccessToken = (accessToken) => {
  setExpirationTimestamp();
  localStorage.setItem("spotify_access_token", accessToken);
  // to do: handle a 'QuotaExceededError'
};

export const getLocalAccessToken = () =>
  localStorage.getItem("spotify_access_token");

export const setLocalRefreshToken = (refreshToken) => {
  localStorage.setItem("spotify_refresh_token", refreshToken);
};

export const getLocalRefreshToken = () => {
  localStorage.getItem("spotify_refresh_token");
};

export const checkAuth = async () => {
  if (!getLocalAccessToken()) {
    return false; // No access token in storage
  }

  if (new Date().getTime() > getExpirationTimestamp()) {
    console.log("fetchRefreshToken executed from inside checkAuth")
    await fetchRefreshToken(); // Token has expired, get new one
  } else {
    return true; // access token present and not expired
  }
};
