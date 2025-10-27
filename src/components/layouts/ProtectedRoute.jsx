import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useVerifyMeQuery } from "../../redux/features/auth/authApi";
import { useEffect } from "react";
import { logout } from "../../redux/features/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";
import Loader from "../shared/Loader";

const ProtectedRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // /me API hit
  const { data, isLoading, isError, error } = useVerifyMeQuery(user?.role, {
    skip: !isAuthenticated || !user?.role,
  });

  useEffect(() => {
    if (isError && error?.status === 401) {
      dispatch(logout());
    }
  }, [isError]);

  if (isLoading) return <Loader />;

  if (!isAuthenticated || !data) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
