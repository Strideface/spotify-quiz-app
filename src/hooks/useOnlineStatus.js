import { useState, useEffect } from "react";

// taken from: https://react.dev/learn/reusing-logic-with-custom-hooks

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  function handleOnline() {
    setIsOnline(true);
  }
  function handleOffline() {
    setIsOnline(false);
  }

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
