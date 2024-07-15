import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./components/Root";
import MainPage from "./pages/MainPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage key="MainPage" /> },
      { path: "/leaderboard", element: <LeaderboardPage /> },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
