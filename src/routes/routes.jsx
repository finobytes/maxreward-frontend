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
import { merchantRoute } from "./merchant.route";
import PublicReferral from "../pages/member/publicReferral/PublicReferral";
import VoucherPaymentSuccess from "../pages/VoucherPaymentSuccess";
import VoucherPaymentCancel from "../pages/VoucherPaymentCancel";

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
    path: "/merchant",
    element: (
      <ProtectedRoute role="merchant">
        <App />
      </ProtectedRoute>
    ),
    children: [...merchantRoute],
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
    element: <ResetSuccess />,
  },
  {
    path: "/public-referral",
    element: <PublicReferral />,
  },
  {
    path: "/voucher/payment/success",
    element: <VoucherPaymentSuccess />,
  },
  {
    path: "/voucher/payment/cancel",
    element: <VoucherPaymentCancel />,
  },
]);

export default router;
