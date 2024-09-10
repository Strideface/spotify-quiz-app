import { fetchRefreshToken } from "./spotify-api";

// functions to set and get Spotify's auth details in local storage so they can be retrieved.

// A NOTE ON AUTHENTICATION HANDLING GENERALLY THROUGHOUT THE WHOLE APP:
// .
// The first way is REACTIVE - every time a fetch function is run (spotify API calls within spotify-api.js), to get data after user has been authenticated,
// getLocalAccessToken is called and if not present, fetchRefreshToken is called. When an error is thrown because it's not possible (e.g. deleted local storage),
// this can then be handled in any jsx component initiating the fetch (generally via tanstack query) with help of the useRedirectToSignn hook (custom hook).
// I.e. error = failed refetch token so redirect user to sign-in.
// Diagram of flow here: https://docs.google.com/drawings/d/1PL-F0q1pTlzOJkYGIm9E7-O4GuC9nRMItPXdMQlsz08/edit?usp=sharing

// .
// The second way is PROACTIVE (ish) - call the useAuthCheck hook (custom hook) at the begninning of each 'quiz stages' components. E.g. User moves on to SelectPlaylistStage,
// useAuthCheck redirects to sign-in if not authenticated.
// useAuthCheck = is there an access token in local storage or not.

const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

export const setExpirationTimestamp = () => {
  const dateObj = new Date(Date.now() + EXPIRATION_TIME).getTime(); // add 1 hour to current time
  localStorage.setItem("spotify_expiration_timestamp", dateObj);
};

export const getExpirationTimestamp = () =>
  localStorage.getItem("spotify_expiration_timestamp");

export const setLocalAuthCode = (authCode) => {
  localStorage.setItem("spotify_auth_code", authCode);
};

export const getLocalAuthCode = () => localStorage.getItem("spotify_auth_code");

export const setLocalAccessToken = (accessToken) => {
  setExpirationTimestamp();
  localStorage.setItem("spotify_access_token", accessToken);
};

// function to ensure a valid access token for Spotify API requests
export const getLocalAccessToken = async () => {
  // check if current token is expired
  if (new Date().getTime() > parseInt(getExpirationTimestamp())) {
    let accessToken = await fetchRefreshToken(); // Token has expired, get new one
    return accessToken;
  } else {
    if (!localStorage.getItem("spotify_access_token")) {
      const error = new Error("No access token in local storage");
      error.info = "NO_TOKEN";
      throw error;
    } else {
      return localStorage.getItem("spotify_access_token");
    }
  }
};

export const setLocalRefreshToken = (refreshToken) => {
  localStorage.setItem("spotify_refresh_token", refreshToken);
};

export const getLocalRefreshToken = () => {
  if (!localStorage.getItem("spotify_refresh_token")) {
    const error = new Error("No refresh token in local storage");
    error.info = "NO_TOKEN";
    throw error;
  } else {
    return localStorage.getItem("spotify_refresh_token");
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
  localStorage.setItem("code_verifier", codeVerifier);
};

export const getCodeVerifier = () => localStorage.getItem("code_verifier");

export const createCodeChallange = async () => {
  let codeVerifier = getCodeVerifier();
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  return codeChallenge;
};
