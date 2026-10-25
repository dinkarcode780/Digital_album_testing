import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { token: adminToken, admin } = useSelector((state) => state.admin);
  const { token: userToken, user } = useSelector((state) => state.auth);

  if (adminToken && admin) {
    if (admin.userType === "SuperAdmin") {
      return <Navigate to="/super-admin/dashboard" replace />;
    }

    return <Navigate to="/admin/dashboard" replace />;
  }

  if (userToken && user) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;