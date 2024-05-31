import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import MainPage from "./pages/MainPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <MainPage /> },
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
