import { Progress } from "@nextui-org/progress";

export default function ProgressBar({ progressMax, progressValue }) {
  return (
    <Progress
      size="md"
      color="success"
      aria-label="in progress..."
      maxValue={progressMax}
      value={progressValue}
    ></Progress>
  );
}
