import Results from "./components/Results";

export default function FinalResultsStage() {
  return (
    <div className=" flex-col justify-center p-5 mt-20">
      <h1 className=" flex justify-center pb-5 font-semibold underline underline-offset-8 decoration-primary decoration-4 sm:text-sm-screen-2">
        Final Results
      </h1>
      <Results />
    </div>
  );
}
