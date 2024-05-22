import {
  getLocalAuthCode,
  setLocalAccessToken,
  getLocalAccessToken,
  setLocalRefreshToken,
  getLocalRefreshToken,
  getCodeVerifier,
  setCodeVerifier,
  createCodeChallange,
} from "./authentication";

// A file to store all functions for Spotify API requests

// global variables
const scope = "user-read-private playlist-read-private";
// keep adding to scope where neccessary (depends on endpoints)

const redirectUri = "http://localhost:3000/";
const clientId = "00e6229ed59a4bd8a0e3e91a99deb1f7";
// DELETE? const base64EncodeString = btoa(clientId + ":" + clientSecret);

// DELETE? link provided for the Spotify sign in button so user can authenticate and get a code
// DELETE? export const spotifyAuthenticationLink = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

// open the spotify auth link (Auth Code PKCE flow) programmatically because need to ensure code verifier
// is set at this point and therefore will be the same when getting it from storage for the
// fetchAccessToken function.
export async function openSpotifyAuthenticationLink() {
  setCodeVerifier(); // creates the code verifier value

  let codeChallenge = await createCodeChallange(); // includes the same code verifier value

  const spotifyAuthenticationLink = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  window.open(spotifyAuthenticationLink, "_self");
}

// DELETE? Authorization Code with PKCE Flow
// Request User Authorization
// export async function fetchUserAuthentication() {
//   const queryParams = new URLSearchParams({
//     response_type: "code",
//     client_id: clientId,
//     scope: scope,
//     code_challenge_method: "S256",
//     code_challenge: codeChallenge,
//     redirect_uri: redirectUri,
//   });
//   console.log(queryParams);

//   const response = await fetch(
//     "https://accounts.spotify.com/authorize?" + queryParams,
//     {
//       method: "GET",
//     }
//   );

//   if (!response.ok) {
//     const error = new Error("An error occurred during user authentication");
//     error.code = response.status;
//     error.info = await response.json();
//     throw error;
//   }

//   const responseJson = await response.json();

//   return responseJson;
//   // doesn't need to return anything
// }

// gets access token following user authentication and code retrieval (see Authentication.jsx).
export async function fetchAccessToken() {
  let authCode = getLocalAuthCode();
  let codeVerifier = getCodeVerifier(); // ensures this value is the same when it was created during user auth link

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUri}&client_id=${clientId}&code_verifier=${codeVerifier}`,
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
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}`,
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching spotify refresh token"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const responseJson = await response.json();

  setLocalAccessToken(responseJson.access_token);
  setLocalRefreshToken(responseJson.refresh_token);

  return responseJson.access_token;
}

export async function fetchUserDetails() {
  let accessToken = await getLocalAccessToken();

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

  return userDetails;
}

export async function fetchUserPlaylists() {
  let accessToken = await getLocalAccessToken();
  
  const queryParams = new URLSearchParams({
    limit: 50, // max limit allowed
    offset: 0,
  });
// following while loop handles cases where a user may have more than 50 playlists
  const userPlaylists = [];

  let getNext = true;

  while (getNext) {
    const response = await fetch(
      "https://api.spotify.com/v1/me/playlists?" + queryParams,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const error = new Error(
        "An error occurred while fetching spotify user Playlists"
      );
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    let responseJson = await response.json();

    userPlaylists.push(responseJson);
    // get next batch of playlists if 'next' is not 'null'
    if (responseJson.next) {
      let newOffset =
        parseInt(queryParams.get("offset")) +
        parseInt(queryParams.get("limit"));
      queryParams.set("offset", newOffset);
    } else {
      getNext = false;
    }
  }
  // return an array of playlist items
  let userPlaylistItems = [];
  for (let playlistsObj of userPlaylists) {
    userPlaylistItems.push(...playlistsObj.items);
  }
  console.log(userPlaylistItems)
  return userPlaylistItems;
}

export async function fetchSearchedPlaylists(searchTerm) {
  let accessToken = await getLocalAccessToken();

  const queryParams = new URLSearchParams({
    q: searchTerm,
    type: "playlist",
    limit: 10,
  });

  const response = await fetch(
    "https://api.spotify.com/v1/search?" + queryParams,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching searched playlists"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const searchedPlaylists = await response.json();

  // return an array of playlist items
  let searchedPlaylistsItems = [];
 
  searchedPlaylistsItems.push(...searchedPlaylists.playlists.items);
  console.log(searchedPlaylistsItems)

  return searchedPlaylistsItems;
}

export async function fetchPlaylistTracks(playlistTracksHref) {
  let accessToken = await getLocalAccessToken();

  const response = await fetch(playlistTracksHref, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching playlist tracks");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const playlistTracks = await response.json();

  return playlistTracks;
}
