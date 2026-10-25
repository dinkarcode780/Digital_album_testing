import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const { token: adminToken, admin } = useSelector(
    (state) => state.admin
  );

  const { token: userToken, user } = useSelector(
    (state) => state.auth
  );

  // Logged in user
  const currentUser = admin || user;

  // Token
  const token = adminToken || userToken;

  if (!token || !currentUser) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(currentUser?.userType)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;