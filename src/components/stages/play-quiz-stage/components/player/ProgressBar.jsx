export default function ProgressBar({ progressMax, progressValue }) {
  console.log(`progress max inside progress bar = ${progressMax}`)
  console.log(`progress value inside progress bar = ${progressValue}`)

  return <progress max={progressMax} value={progressValue}></progress>;
}
