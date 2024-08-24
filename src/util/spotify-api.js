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
const scope =
  "user-read-private playlist-read-private user-modify-playback-state user-read-playback-state";
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
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
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
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
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
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
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
        "An error occurred while fetching your playlists."
      );
      error.code = response.status;
      error.info = await response.json();
      console.log(
        error +
          " - status: " +
          error.code +
          "- message: " +
          error.info.error.message
      );
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
  // return an array of playlist items, only if the playlist contains tracks
  let userPlaylistItems = [];
  for (let playlistsObj of userPlaylists) {
    for (let item of playlistsObj.items) {
      if (item.tracks.total > 0) {
        userPlaylistItems.push(item);
      }
    }
  }

  return userPlaylistItems;
}

export async function fetchSearchedItems(searchTerm, market, type, limit) {
  let accessToken = await getLocalAccessToken();

  const queryParams = new URLSearchParams({
    q: searchTerm,
    type: type,
    limit: limit,
    market: market,
  });

  const response = await fetch(
    "https://api.spotify.com/v1/search?" + queryParams,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while fetching search items");
    error.code = response.status;
    error.info = await response.json();
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
    throw error;
  }

  const searchResults = await response.json();

  // return an array of playlist items
  let searchResultsItems = [];

  if (searchResults.playlists) {
    searchResultsItems.push(...searchResults.playlists.items);
  } else if (searchResults.artists) {
    searchResultsItems.push(...searchResults.artists.items);
  } else if (searchResults.tracks) {
    searchResultsItems.push(...searchResults.tracks.items);
  }

  return searchResultsItems;
}

export async function fetchPlaylistTracks(
  playlistTracksHref,
  market,
  limit,
  playlistTotalTracks
) {
  let accessToken = await getLocalAccessToken();

  const queryParams = new URLSearchParams({
    // if limit param is less than 100 then use that value, otherwise get 100 at a time until limit is reached.
    limit: limit < 100 ? limit : 100, // 100 is max limit allowed per fetch
    // randomize the offset if limit selected is different to playlistTotalTracks. Otherwise, always be getting from first track.
    offset: Math.floor(Math.random() * (playlistTotalTracks - limit)), // Returns a random integer from 0 to the difference of playlistTotalTracks - limit:
    market: market,
  });

  // while loop handles cases where a playlist (or the limit set) has more than 100 tracks
  const playlistTracks = [];
  let getNext = true;
  let finalLimit = null;
  let remainingLimit = limit;

  while (getNext) {
    const response = await fetch(playlistTracksHref + "?" + queryParams, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const error = new Error(
        "An error occurred while fetching playlist tracks"
      );
      error.code = response.status;
      error.info = await response.json();
      console.log(
        error +
          " - status: " +
          error.code +
          "- message: " +
          error.info.error.message
      );
      throw error;
    }

    let responseJson = await response.json();

    playlistTracks.push(responseJson);

    // record how many tracks left to get (Irrelevant if limit param is less than 100 and remainingLimit is now a minus figure.
    remainingLimit = remainingLimit - 100;
    // Discontinue if no tracks left to get
    if (remainingLimit === 0) {
      break;
    }

    // get next batch of tracks if 'next' is not 'null', the initial limit is more than 100, and we haven't reached the final fetch yet.
    if (responseJson.next && limit >= 100 && !finalLimit) {
      let newOffset =
        parseInt(queryParams.get("offset")) +
        parseInt(queryParams.get("limit"));
      queryParams.set("offset", newOffset);

      // determines whether this is the last fetch
      if (remainingLimit < 100) {
        finalLimit = remainingLimit;
        queryParams.set("limit", finalLimit);
      }
    } else {
      getNext = false;
    }
  }

  const quizTracks = [];

  for (let playlistTracksObj of playlistTracks) {
    quizTracks.push(
      ...playlistTracksObj.items.map((item) => ({
        artist: item.track.artists,
        album: {
          name: item.track.album.name,
          href: item.track.album.href,
          images: item.track.album.images,
        },
        track: {
          name: item.track.name,
          href: item.track.href,
          id: item.track.id,
          uri: item.track.uri,
          isPlayable: item.track.is_playable,
          preview: item.track.preview_url,
          duration: item.track.duration_ms,
        },
      }))
    );
  }

  return quizTracks;
}

export async function fetchArtistTopTracks(id, market) {
  let accessToken = await getLocalAccessToken();

  const queryParams = new URLSearchParams({
    market: market,
  });

  const response = await fetch(
    "https://api.spotify.com/v1/artists/" + id + "/top-tracks?" + queryParams,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching artist tracks"
    );
    error.code = response.status;
    error.info = await response.json();
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
    throw error;
  }

  const searchResults = await response.json();

  // return an array of track items

  const artistTrackItems = searchResults.tracks;

  return artistTrackItems;
}

async function fetchPlaybackState() {
  let accessToken = await getLocalAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching playback state");
    error.code = response.status;
    error.info = await response.json();
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
    throw error;
  }

  let results = null;
  // if no playback state is detected then endpoint returns a 204 (OK but empty response)
  // therefore, create a response by returning null
  if (response.status === 204) {
    return results;
  }
  // playback state detected and retruns a 200 with response data
  const responseJson = await response.json();

  const activeDevice = responseJson.device;
  const currentTrackUri = responseJson.item ? responseJson.item.uri : null;
  const progress = responseJson.progress_ms;

  results = {
    activeDevice: activeDevice,
    currentTrackUri: currentTrackUri,
    progress: progress,
  };

  return results;
}

export async function resumePlayback(trackUri, resumeFromStart) {
  const playbackStateResults = await fetchPlaybackState();

  if (!playbackStateResults) {
    const error = new Error(
      "You do not have an active device. Please play content from Spotify and try again"
    );
    throw error;
  }
  // if the trackUri being passed in does not equal the trackUri in playback state data
  // set progress to 0 so it plays from start, as it must be a new track.
  // or if the optional resumeFromStart value is true, set progress to 0 (for the repeat button)
  if (trackUri !== playbackStateResults.currentTrackUri || resumeFromStart) {
    playbackStateResults.progress = 0;
  }

  let accessToken = await getLocalAccessToken();

  const queryParams = new URLSearchParams({
    device_id: playbackStateResults.activeDevice.id,
  });

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/play?" + queryParams,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [trackUri],
        position_ms: playbackStateResults.progress,
      }),
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred when attempting playback");
    error.code = response.status;
    error.info = await response.json();
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
    throw error;
  }

  return "pause playback success";
}

export async function pausePlayback() {
  let accessToken = await getLocalAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred when attempting to pause");
    error.code = response.status;
    error.info = await response.json();
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message
    );
    throw error;
  }

  return "pause playback success";
}
