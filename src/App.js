import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/system";

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
      <NextUIProvider>
        <main className="light text-foreground bg-background">
          <RouterProvider router={router} />
        </main>
      </NextUIProvider>
    </QueryClientProvider>
  );
}

export default App;
