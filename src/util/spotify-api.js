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

// redirect url needs to change if running locally versus production
const redirectUri =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_SPOTIFY_REDIRECT_URI_DEV
    : process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

// open the spotify auth link (Auth Code PKCE flow) programmatically because need to ensure code verifier
// is set at this point and therefore will be the same when getting it from storage for the
// fetchAccessToken function.
export async function openSpotifyAuthenticationLink() {
  setCodeVerifier(); // creates the code verifier value

  let codeChallenge = await createCodeChallange(); // includes the same code verifier value

  const spotifyAuthenticationLink = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  window.open(spotifyAuthenticationLink, "_self");
}

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
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log(
      error +
        " - status: " +
        error.code +
        "- message: " +
        error.info.error.message +
        "- error.info.error: " +
        error.info.error
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
    // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
      // As of 27th Nov 24, Spotify API no longer returns "Algorithmic and Spotify-owned editorial playlists"
      // these playlists return 'null', therefore must check for value (i.e. if not 'null'). https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api
      if (item) {
        if (item.tracks.total > 0) {
          userPlaylistItems.push(item);
        }
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
  });
  // only pass in a market value if one was receieved through params
  // (if user details were not retrieved for any reason, market value would be empty as this is where I'm getting it from currently)
  // however, also note that: "If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter."
  if (market) {
    queryParams.append("market", market);
  }

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
    // eslint-disable-next-line no-console
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

  // return an array of items
  let searchResultsItems = [];

  if (searchResults.playlists) {
    for (let item of searchResults.playlists.items) {
      // As of 27th Nov 24, Spotify API no longer returns "Algorithmic and Spotify-owned editorial playlists"
      // these playlists return 'null', therefore must check for value (i.e. if not 'null'). https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api
      if (item) {
        // don't return any playlists that have 0 tracks
        if (item.tracks.total > 0) {
          searchResultsItems.push(item);
        }
      }
    }
  } else if (searchResults.artists) {
    searchResultsItems.push(...searchResults.artists.items);
  } else if (searchResults.tracks) {
    searchResultsItems.push(...searchResults.tracks.items);
  }

  return searchResultsItems;
}

export async function fetchCompetePlaylists() {
  let accessToken = await getLocalAccessToken();
  // ** hard coding the specific playlists to be used as they have been pre-selected and should always remain the same
  // to standardize the competition and results. Will need to change if any of them get deleted **
  // These playlists have been created by me because I need a way of telling the app which genre these playlists are.
  // The genre is stated in the description and then incorporated into the quizData object.

  const playlistIds = [
    "2LrFcj7DshhuDQF4lP2fSv",
    "1hWjtqMectOC0ZA1tnBYOU",
    "44H8EfWbeVdjCGOAQkKvng",
  ];
  // rock, modern pop, hip-hop

  // Loop through array of playlist Ids and store each playlist object returned.
  const playlists = [];
  for (let i = 0; i < playlistIds.length; i++) {
    const response = await fetch(
      "https://api.spotify.com/v1/playlists/" + playlistIds[i],
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const error = new Error("An error occurred while fetching playlists.");
      error.code = response.status;
      error.info = await response.json();
      // eslint-disable-next-line no-console
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
    playlists.push(responseJson);
  }

  return playlists;
}

export async function fetchPlaylistTracks(
  id,
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
  });
  // only pass in a market value if one was receieved through params
  // (if user details were not retrieved for any reason, market value would be empty as this is where I'm getting it from currently)
  // however, also note that: "If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter."
  if (market) {
    queryParams.append("market", market);
  }

  // while loop handles cases where a playlist (or the limit set) has more than 100 tracks
  const playlistTracks = [];
  let getNext = true;
  let finalLimit = null;
  let remainingLimit = limit;

  while (getNext) {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks?` + queryParams,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const error = new Error(
        "An error occurred while fetching playlist tracks"
      );
      error.code = response.status;
      error.info = await response.json();
      // eslint-disable-next-line no-console
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

  const queryParams = new URLSearchParams();

  // only pass in a market value if one was receieved through params
  // (if user details were not retrieved for any reason, market value would be empty as this is where I'm getting it from currently)
  // however, also note that: "If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter."
  if (market) {
    queryParams.append("market", market);
  }

  const response = await fetch(
    "https://api.spotify.com/v1/artists/" + id + "/top-tracks?" + queryParams,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while fetching artist tracks");
    error.code = response.status;
    error.info = await response.json();
    // eslint-disable-next-line no-console
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

export async function fetchPlaybackState() {
  let accessToken = await getLocalAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = new Error("An error occurred");
    error.code = response.status;
    error.info = await response.json();
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
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

export async function fetchUsers(userIds) {
  let accessToken = await getLocalAccessToken();

  // loop through each id in the userIds array and get details for each user
  const userDetails = [];

  for (let i = 0; i < userIds.length; i++) {
    const response = await fetch(
      "https://api.spotify.com/v1/users/" + userIds[i],
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      // If an error occurs wihh a status: 400 - message: Invalid username - It should be because the user id no longer exists.
      // This could happen if a Spotify user saves a result on the db but later deletes their Spotify account.
      // add a custom object for these cases and then break the for loop so it fetches next user, or ends.
      if (response.status === 400) {
        userDetails.push({
          name: "Deactivated User",
          image: null,
        });
        break;

      } else {
        const error = new Error(
          "An error occurred while fetching spotify user details"
        );
        error.code = response.status;
        error.info = await response.json();
        // eslint-disable-next-line no-console
        console.log(
          error +
            " - status: " +
            error.code +
            "- message: " +
            error.info.error.message
        );
        throw error;
      }
    }

    let responseJson = await response.json();
    let name = responseJson.display_name;
    let image = responseJson.images[0] ? responseJson.images[0].url : null;

    userDetails.push({
      name,
      image,
    });
  }

  return userDetails;
}
