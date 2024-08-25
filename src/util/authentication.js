import { fetchRefreshToken } from "./spotify-api";

// functions to set and get Spotify's auth details in local storage so they can be retrieved.

// A NOTE ON AUTHENTICATION HANDLING GENERALLY THROUGHOUT THE WHOLE APP:
// .
// The first way is every time a fetch function is run (spotify API calls within spotify-api.js), to get data after user has been authenticated, 
// getLocalAccessToken is called and if not present, fetchRefreshToken is called. When an error is thrown because it's not possible (e.g. deleted local storage),
// this can then be handled in any jsx component initiating the fetch (generally via tanstack query). I.e. error = failed refetch token so redirect user to sign-in.
// .
// The second way is to call the checkAuth function at the begninning of each 'quiz stages' components. E.g. User moves on to SelectPlaylistStage, useEffect calls
// checkAuth and redirects to sign-in if not authenticated.

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

// function to ensure a valid access token for Spotify API requests
export const getLocalAccessToken = async () => {
  // check if current token is expired
  if (new Date().getTime() > getExpirationTimestamp()) {
    let accessToken = await fetchRefreshToken(); // Token has expired, get new one
    return accessToken;
  } else {
    return localStorage.getItem("spotify_access_token");
  }
};

export const setLocalRefreshToken = (refreshToken) => {
  localStorage.setItem("spotify_refresh_token", refreshToken);
};

export const getLocalRefreshToken = () => {
  return localStorage.getItem("spotify_refresh_token");
};

// determine if user is authenticated or not.
export const checkAuth = () => {
  if (!localStorage.getItem("spotify_access_token")) {
    return false; // No access token in storage
  } else {
    return true; // access token present
  }
};

// helper functions to create code verifier and code challange used in Spotify Authorization Code with PKCE Flow

const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const setCodeVerifier = () => {
  let codeVerifier = generateRandomString(64);
  console.log(`code verifier when set: ${codeVerifier}`);
  localStorage.setItem("code_verifier", codeVerifier);
};

export const getCodeVerifier = () => localStorage.getItem("code_verifier");

export const createCodeChallange = async () => {
  let codeVerifier = getCodeVerifier();
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  return codeChallenge;
};
