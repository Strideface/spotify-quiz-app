export default function ProgressBar({ progressMax, progressValue }) {

  return <progress max={progressMax} value={progressValue}></progress>;
}
