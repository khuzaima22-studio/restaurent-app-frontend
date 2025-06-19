import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/login";
import Layout from "./pages/dashboard/layout";
import Dashboard from "./pages/dashboard/dashboard";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/landingPage";
import UserTable from "./pages/dashboard/user-table";
import BranchTable from "./pages/dashboard/branch-table";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "user", element: <UserTable /> },
      { path: "branch", element: <BranchTable /> },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
