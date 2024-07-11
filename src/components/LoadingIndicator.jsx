export default function LoadingIndicator({ loadingMessage }) {
  return (
    <div>
      <p>{loadingMessage ?  loadingMessage  : "Loading..."}</p>
    </div>
  );
}
