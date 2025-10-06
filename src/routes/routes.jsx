import { createBrowserRouter, Navigate } from "react-router";
import Login from "../pages/authPages/Login";
import ResetPassword from "../pages/authPages/ResetPassword";
import OTP from "../pages/authPages/OTP";
import NewPassword from "../pages/authPages/NewPassword";
import ResetSuccess from "../pages/authPages/ResetSuccess";
import App from "../App";
import { adminRoutes } from "./admin.route";
import { memberRoutes } from "./member.route";
import ProtectedRoute from "../components/layouts/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <App />
      </ProtectedRoute>
    ),
    children: [...adminRoutes],
  },
  {
    path: "/member",
    element: (
      <ProtectedRoute role="member">
        <App />
      </ProtectedRoute>
    ),
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
