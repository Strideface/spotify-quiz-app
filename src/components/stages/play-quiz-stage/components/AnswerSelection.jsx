import AsyncSelect from "react-select/async";
import { useRef, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

import {
  fetchArtistTopTracks,
  fetchSearchedItems,
} from "../../../../util/spotify-api";
import { shuffleArray } from "../../../../util/util";
import { Button } from "@nextui-org/button";
import Alert from "../../../Alert";

export default function AnswerSelection({
  activeTrackIndex,
  setUserResponse,
  artistIsCorrect,
  trackIsCorrect,
  setTimerIsFinished,
}) {
  const { quizData, setQuizStage } = useOutletContext();
  const [selectedValue, setSelectedValue] = useState({
    artist: null,
    track: null,
  });
  const [error, setError] = useState(null);

  const lastChange = useRef();
  const artistSearchBar = useRef();
  const trackSelector = useRef();
  console.log(error)

  // https://www.dhiwise.com/post/how-to-implement-a-react-search-bar-with-dropdown
  // https://react-select.com/home

  // function must return a promise
  // artist search bar
  const searchloadOptions = (inputValue) => {
    // DEBOUNCING: only change inputValue once user stops typing after specified time in setTimeout
    // reduces amount of Spotify API calls (i.e. not after every key stroke)
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    if (inputValue.trim().length !== 0) {
      let options = [];
      return new Promise((resolve) => {
        lastChange.current = setTimeout(() => {
          lastChange.current = null;

          resolve(
            fetchSearchedItems(
              inputValue,
              quizData.current.userDetails.country,
              "artist",
              10
            )
              .then((searchItemsData) => {
                setError(null);
                searchItemsData.map((item) =>
                  options.push({
                    label: item.name,
                    value: item.name,
                    id: item.id,
                  })
                );
                // return an array of artist options for the user to select following a search
                return options;
              })
              .catch((err) => {
                setError(err);
                console.log(err)
                if (err?.info?.error === "invalid_grant") {
                  setQuizStage((prevState) => ({
                    ...prevState,
                    playQuizStage: false,
                    gameTilesStage: true,
                  }));
                }
                return options;
              })
          );
        }, 1000);
      });
    }
  };

  // handles the changing of a selection from the artist search
  const handleSearchOnChange = (value, actionType) => {
    if (actionType.action === "select-option") {
      setSelectedValue((prevState) => ({
        artist: value,
        track: null,
      }));
    } else if (actionType.action === "clear") {
      setSelectedValue((prevState) => ({
        artist: null,
        track: null,
      }));
    }
  };

  // track selector
  const trackSelectorLoadOptions = () => {
    let options = [];

    return new Promise((resolve) => {
      resolve(
        fetchArtistTopTracks(
          selectedValue.artist.id,
          quizData.current.userDetails.country
        )
          .then((artistTrackItemsData) => {
            setError(null);
            artistTrackItemsData.map((item) =>
              options.push({
                label: item.name,
                value: item.name,
                id: item.id,
              })
            );
            // for every artist credited to the current track, because some tracks have many artists
            for (let artist of quizData.current.quizTracks[
              activeTrackIndex.current
            ].artist) {
              // if the artist selected in the artist search bar matches the artist/s in the currently playing track
              if (artist.id === selectedValue.artist.id) {
                // then, if the currently playing track by that artist is not in the list of top tracks being returned, add it.
                // so that the user has the possibility of selecting the right answer (top tracks won't neccessarily contain the track currently playing)

                let idMatch = options.filter(
                  (track) =>
                    track.id ===
                    quizData.current.quizTracks[activeTrackIndex.current].track
                      .id
                );
                if (idMatch.length === 0) {
                  options.push({
                    label:
                      quizData.current.quizTracks[activeTrackIndex.current]
                        .track.name,
                    value:
                      quizData.current.quizTracks[activeTrackIndex.current]
                        .track.name,
                    id: quizData.current.quizTracks[activeTrackIndex.current]
                      .track.id,
                  });
                }
              }
            }

            // also check if there is now more than one track with the same name in options and remove the one that does not match the current track ID
            // so that the user does not select the track that does not match the current track ID (i.e. remove duplicates)
            let trackNameMatch = options.filter(
              (track) =>
                track.value.toLowerCase() ===
                quizData.current.quizTracks[
                  activeTrackIndex.current
                ].track.name.toLowerCase()
            );
            // options should already contain the current track at this point so more than 1 match means duplicates
            if (trackNameMatch.length > 1) {
              let duplicates = trackNameMatch.filter(
                (track) =>
                  track.id !==
                  quizData.current.quizTracks[activeTrackIndex.current].track.id
              );
              for (let track of duplicates) {
                let itemIndex = options.indexOf(track);
                options.splice(itemIndex, 1);
              }
            }

            // always return the list of options in random order, oherwise the added correct option will always be in the same position.
            shuffleArray(options);
            return options;
          })
          .catch((err) => {
            setError(err);
            return options;
          })
      );
    });
  };

  // handles the changing of a selection from the track selector
  const handleTrackSelectorOnChange = (value, actionType) => {
    if (actionType.action === "select-option") {
      setSelectedValue((prevState) => ({
        ...prevState,
        track: value,
      }));
    } else if (actionType.action === "clear") {
      setSelectedValue((prevState) => ({
        ...prevState,
        track: null,
      }));
    }
  };

  const handleSubmitAnswer = () => {
    // this logic marks the answer
    // May be more than one artist for track so loop through and check if answer matches any
    for (let artist of quizData.current.quizTracks[activeTrackIndex.current]
      .artist) {
      if (selectedValue.artist.id === artist.id) {
        artistIsCorrect.current = true;
        quizData.current.quizResults.totalPoints += 1;
        quizData.current.quizResults.totalCorrectArtists += 1;
        // also mutate the artist array so that the selected artist appears in the first index (if more than one arist and that's not the case already)
        // this is because results modal in Quiz displays artist in the first index.
        if (
          selectedValue.artist.id !==
          quizData.current.quizTracks[activeTrackIndex.current].artist[0].id
        ) {
          let itemIndex =
            quizData.current.quizTracks[
              activeTrackIndex.current
            ].artist.indexOf(artist);
          quizData.current.quizTracks[activeTrackIndex.current].artist.splice(
            itemIndex,
            1
          );
          quizData.current.quizTracks[activeTrackIndex.current].artist.unshift(
            artist
          );
        }
      } else {
        artistIsCorrect.current = false;
      }
    }
    // mark track
    if (
      selectedValue.track.id ===
      quizData.current.quizTracks[activeTrackIndex.current].track.id
    ) {
      trackIsCorrect.current = true;
      quizData.current.quizResults.totalPoints += 1;
      quizData.current.quizResults.totalCorrectTracks += 1;
    } else {
      trackIsCorrect.current = false;
    }
    setTimerIsFinished(true);

    setUserResponse((prevState) => {
      return [...prevState, selectedValue];
    });
  };

  const handleSkip = useCallback(() => {
    quizData.current.quizResults.totalSkipped += 1;
    artistIsCorrect.current = false;
    trackIsCorrect.current = false;

    setTimerIsFinished(true);

    setUserResponse((prevState) => {
      return [...prevState, "SKIPPED"];
    });
  }, [
    artistIsCorrect,
    quizData,
    setTimerIsFinished,
    setUserResponse,
    trackIsCorrect,
  ]);

  // IS THERE A WAY TO CACHE PREVIOUS ARTIST SEARCHES WHILST DESTROYING THIS COMPONENT? CACHE ONLY WORKS WHEN COMPONENT ISN'T UNMOUNTED,
  // WHICH IS CURRENTLY HAPPENING BECAUSE YOU'RE PASSING IN A KEY TO THIS COMPONENT.
  // OR, A WAY FOR THE BROWSER TO SUGGEST PREVIOUSLY TYPED IN SEARCHES. ATTRIBUTE OPTION OF THE UNDERLYING ELEMENT?

  // Can only figure out how to override the existing default theme colors.
  // Ideally would like to extend the color theme to reflect my custom Next UI color theme
  // https://react-select.com/styles#overriding-the-theme
  const selectTheme = (theme) => ({
    ...theme,
    borderRadius: 0,
    colors: {
      ...theme.colors,
      primary: "#1DB954", // spotify-green
      primary25: "#1DB954", // spotify-green
      primary50: "#1ed760", // // spotify-green
    },
  });

  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? "primary" : "black",
      borderRadius: "2rem",
    }),
  };

  const classNames = " font-medium text-mobile-3 md:text-sm-screen-2";

  return (
    <>
      <AsyncSelect
        ref={artistSearchBar}
        isSearchable={!selectedValue.artist}
        cacheOptions
        isClearable
        placeholder="search for artists..."
        noOptionsMessage={() => "search to see results"}
        loadingMessage={() => "searching Spotify..."}
        loadOptions={searchloadOptions}
        onChange={(value, action) => handleSearchOnChange(value, action)}
        theme={selectTheme}
        styles={selectStyles}
        className={classNames}
      />

      {selectedValue.artist && (
        <AsyncSelect
          ref={trackSelector}
          isSearchable={false}
          cacheOptions
          isClearable
          placeholder="select track..."
          defaultOptions
          loadOptions={trackSelectorLoadOptions}
          onChange={(value, action) =>
            handleTrackSelectorOnChange(value, action)
          }
          theme={selectTheme}
          styles={selectStyles}
          className={classNames}
        />
      )}

      {error && <Alert message={error.message} />}

      <motion.div className=" flex justify-center" whileHover={{ scale: 1.02 }}>
        {selectedValue.track ? (
          <Button
            className=" font-medium sm:text-sm-screen-2 sm:w-80"
            color="primary"
            size="lg"
            onPress={handleSubmitAnswer}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            className=" bg-foreground text-background sm:text-sm-screen-2 sm:w-80"
            size="lg"
            onPress={handleSkip}
          >
            Skip
          </Button>
        )}
      </motion.div>
    </>
  );
}
