import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserTie,
  FaUserFriends,
  FaPhotoVideo,
  FaCalendarAlt,
  FaLayerGroup,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaCreditCard,
  FaStore,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../../app/admin/adminThunk";

export const superAdminMenus = [
  {
    name: "Dashboard",
    path: "/super-admin/dashboard",
    icon: <FaTachometerAlt />,
    badge: null,
  },
  {
    name: "Studio Showcases",
    path: "/super-admin/studio-showcases",
    icon: <FaStore />,
    badge: "Public",
  },
  {
    name: "Studio Admins",
    path: "/super-admin/admins",
    icon: <FaUserTie />,
    badge: null,
  },
  {
    name: "Clients & Users",
    path: "/super-admin/clients",
    icon: <FaUserFriends />,
    badge: null,
  },
  {
    name: "All Media & Albums",
    path: "/super-admin/media",
    icon: <FaPhotoVideo />,
    badge: "Full Access",
  },
  {
    name: "Events & Shoots",
    path: "/super-admin/events",
    icon: <FaCalendarAlt />,
    badge: null,
  },
  {
    name: "Categories",
    path: "/super-admin/categories",
    icon: <FaLayerGroup />,
    badge: null,
  },
  {
    name: "Subscription Plans",
    path: "/super-admin/subscription-plans",
    icon: <FaCreditCard />,
    badge: null,
  },
  {
    name: "Settings",
    path: "/super-admin/settings",
    icon: <FaCog />,
    badge: null,
  },
];

const SuperAdminSidebar = () => {
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(adminLogout());
    navigate("/");
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 w-72 h-screen bg-white shadow-xl flex-col z-40 border-r border-gray-100">
      {/* Brand Header */}
      <div className="h-20 border-b flex items-center px-6 gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
          <FaShieldAlt className="text-xl" />
        </div>
        <Link to="/super-admin/dashboard" className="flex-1">
          <h1 className="text-xl font-black bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
            Album Studio
          </h1>
          <p className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">
            Super Admin Control
          </p>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="py-5 px-6 border-b bg-purple-50/50 flex items-center gap-3">
        <img
          src={admin?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
          alt={admin?.name || "Super Admin"}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/30"
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm text-gray-800 truncate">
            {admin?.name || "Super Admin"}
          </h2>
          <div className="flex items-center gap-1 text-purple-700 text-xs font-medium mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Super Administrator</span>
          </div>
        </div>
      </div>

      {/* Navigation Menus */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Main Navigation
        </div>

        {superAdminMenus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-purple-500/20"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-700 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-gray-500 group-hover:text-purple-600"}`}>
                    {menu.icon}
                  </span>
                  <span className="text-sm">{menu.name}</span>
                </div>
                {menu.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {menu.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
        >
          <FaSignOutAlt />
          Logout Session
        </button>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
