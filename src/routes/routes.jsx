import { createBrowserRouter } from "react-router";
import Login from "../pages/authPages/Login";
import ResetPassword from "../pages/authPages/ResetPassword";
import OTP from "../pages/authPages/OTP";

const router = createBrowserRouter([
  {
    path: "/",
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
]);

export default router;
