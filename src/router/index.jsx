import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, User } from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div>Hubo un error</div>,
  },
  {
    path: "/user/:login",
    element: <User />,
  },
]);

const CustomRouter = () => <RouterProvider router={router} />;

export { CustomRouter };
