import { useOutletContext } from "react-router-dom"

export default function Results() {

  const { quizData } = useOutletContext();

  return (
    <div className=" flex flex-col justify-center space-y-2 p-10">
        <p>Total Points Scored: {quizData.current.quizResults.totalPoints}</p>
        <p>Total Correct Artists: {quizData.current.quizResults.totalCorrectArtists}</p>
        <p>Total Correct Tracks: {quizData.current.quizResults.totalCorrectTracks}</p>
        <p>Total Skiped: {quizData.current.quizResults.totalSkipped}</p>
        <p>Total Timer Finished: {quizData.current.quizResults.totalTimerFinished}</p>
    </div>
  )    
}