import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaUsers,
  FaFolder,
  FaLayerGroup,
  FaImages,
  FaServicestack,
  FaChartBar,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
  FaFolderOpen,
  FaUserPlus,
  FaHeart,
  FaCreditCard,
  FaStore,
  FaBookOpen,
} from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../../app/admin/adminThunk";

const menus = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Showcase & Profile",
    path: "/admin/studio-profile",
    icon: <FaStore />,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: <FaCalendarCheck />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <FaUsers />,
  },
  {
    name: "Services",
    path: "/admin/services",
    icon: <FaServicestack />,
  },
  {
    name: "Blogs",
    path: "/admin/blogs",
    icon: <FaBookOpen />,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: <FaChartBar />,
  },
  {
    name: "Notifications",
    path: "/admin/notifications",
    icon: <FaBell />,
  },
  {
    name: "Profile",
    path: "/admin/profile",
    icon: <FaUserCircle />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <FaCog />,
  },
  {
    name: "Subscription",
    path: "/admin/subscription",
    icon: <FaCreditCard />,
  },
];

const AdminSidebar = () => {
  const [masterOpen, setMasterOpen] = useState(false);
  const { loading } = useSelector((state) => state.admin);
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(adminLogout());
    navigate("/");
  };
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 w-72 h-screen bg-white shadow-xl flex-col z-40">
      {/* Logo */}

      <div className="h-20 border-b flex items-center justify-center">
        <Link to="/admin/dashboard">
          <h1 className="text-3xl font-bold text-purple-600">Album Studio</h1>

          <p className="text-sm text-gray-500 text-center">Admin Panel</p>
        </Link>
      </div>

      {/* Profile */}

      <div className="py-6 border-b flex flex-col items-center">
        <img
          src={admin?.profileImage || "https://i.pravatar.cc/100?img=12"}
          alt={admin?.name || "Admin"}
          className="w-16 h-16 rounded-full object-cover"
        />

        <h2 className="font-bold text-lg mt-3">
          {admin?.name || "Dinkar Paswan"}
        </h2>

        <p className="text-gray-500 text-sm">
          {admin?.userType || "Super Admin"}
        </p>
      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto py-5">
        {/* {menus.map((menu) => (

          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `mx-3 mb-2 flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-purple-100 hover:text-purple-600"
              }`
            }
          >
            <span className="text-xl">
              {menu.icon}
            </span>

            <span className="font-medium">
              {menu.name}
            </span>

          </NavLink>

        ))} */}

        {menus.map((menu, index) => (
          <React.Fragment key={menu.path}>
            {/* Normal Menu */}
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                `mx-3 mb-2 flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-purple-100 hover:text-purple-600"
                }`
              }
            >
              <span className="text-xl">{menu.icon}</span>

              <span className="font-medium">{menu.name}</span>
            </NavLink>

            {/* Dashboard ke baad Master */}
            {index === 0 && (
              <div className="mx-3 mb-2">
                <button
                  onClick={() => setMasterOpen(!masterOpen)}
                  className="w-full flex items-center justify-between px-5 py-3 rounded-xl hover:bg-purple-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <FaFolderOpen className="text-xl" />
                    <span className="font-medium">Master</span>
                  </div>

                  {masterOpen ? <FaChevronDown /> : <FaChevronRight />}
                </button>

                {masterOpen && (
                  <div className="ml-5 mt-2 space-y-2">
                    <NavLink
                      to="/admin/categories"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaFolder />
                      Categories
                    </NavLink>

                    <NavLink
                      to="/admin/sub-categories"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaLayerGroup />
                      Sub Categories
                    </NavLink>

                    <NavLink
                      to="/admin/events"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaCalendarCheck />
                      Events
                    </NavLink>

                    <NavLink
                      to="/admin/media"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaImages />
                      Upload Media
                    </NavLink>

                    <NavLink
                      to="/admin/albums"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaImages />
                      Albums
                    </NavLink>

                    <NavLink
                      to="/admin/admininvite"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaUserPlus />
                      Invites
                    </NavLink>

                    <NavLink
                      to="/admin/adminfavorite"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaHeart />
                      User Selections
                    </NavLink>

                     <NavLink
                      to="/admin/blogs"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "hover:bg-purple-100"
                        }`
                      }
                    >
                      <FaCalendarCheck />
                      Blogs
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Logout */}

      <div className="border-t p-5">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 cursor-pointer rounded-xl flex items-center justify-center gap-3 transition disabled:opacity-50"
        >
          <FaSignOutAlt />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
