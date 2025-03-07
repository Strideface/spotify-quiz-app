// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function convertToPercentageScore(totalPoints, totalTracks) {
  return Math.floor((totalPoints / (totalTracks * 2)) * 100);
}
