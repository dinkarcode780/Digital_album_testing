import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ role, roles = [] }) => {
  const { admin } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  const currentUser = admin || user;

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const allowedRoles = role ? [role] : roles;

  if (!allowedRoles.includes(currentUser.userType)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;