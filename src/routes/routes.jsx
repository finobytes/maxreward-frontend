import { createBrowserRouter } from "react-router";
import Login from "../pages/authPages/Login";
import ResetPassword from "../pages/authPages/ResetPassword";
import OTP from "../pages/authPages/OTP";
import NewPassword from "../pages/authPages/NewPassword";
import ResetSuccess from "../pages/authPages/ResetSuccess";
import App from "../App";
import { adminRoutes } from "./admin.route";
import { memberRoutes } from "./member.route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <App />,
    children: [...adminRoutes],
  },
  {
    path: "/member",
    element: <App />,
    children: [...memberRoutes],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/otp",
    element: <OTP />,
  },
  {
    path: "/new-password",
    element: <NewPassword />,
  },
  {
    path: "/reset-success",
    element: <ResetSuccess />,
  },
]);

export default router;
