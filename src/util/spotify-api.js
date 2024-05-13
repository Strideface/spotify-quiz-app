import {
  setExpirationTimestamp,
  getExpirationTimestamp,
  setLocalAuthCode,
  getLocalAuthCode,
  setLocalAccessToken,
  getLocalAccessToken,
  setLocalRefreshToken,
  getLocalRefreshToken,
} from "./authentication";

// A file to store all API requests for Spotify

// global variables
const scope = "user-read-private playlist-read-private";
// keep adding to scope where neccessary (depends on endpoints)
const redirectUri = "http://localhost:3000/";
const clientId = "00e6229ed59a4bd8a0e3e91a99deb1f7";
const clientSecret = "9e703c3ab9fc4decb9cc97067890ada7";
const base64EncodeString = btoa(clientId + ":" + clientSecret);

// link provided for the Spotify sign in button so user can authenticate and get a code
export const spotifyAuthenticationLink = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

// gets access token following user authentication and code retrieval.
export async function fetchAccessToken() {
  let authCode = getLocalAuthCode();

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + base64EncodeString,
    },
    body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUri}`,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching spotify access token"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const responseJson = await response.json();

  setLocalAccessToken(responseJson.access_token);
  setLocalRefreshToken(responseJson.refresh_token);

  return responseJson.access_token;
  // doesn't need to return access token as already stores it.
}

export async function fetchRefreshToken() {
  let refreshToken = getLocalRefreshToken();

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + base64EncodeString,
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching spotify refresh token"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error + ": " + error.info;
  }

  const responseJson = await response.json();

  setLocalAccessToken(responseJson.access_token);
  setLocalRefreshToken(responseJson.refresh_token);

  return responseJson.access_token;
  // doesn't need to return access token as already stores it.
}

export async function fetchUserDetails() {
  let accessToken = getLocalAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching spotify user details"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const userDetails = await response.json();

  console.log(userDetails);

  return userDetails;
}

export async function fetchUserPlaylists(limit = 20, offset = 0) {
  let accessToken = getLocalAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching spotify user Playlists"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const userPlaylists = await response.json();

  // console.log(userPlaylists);

  return userPlaylists;
}
