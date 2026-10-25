import React from "react";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaCalendarCheck,
  FaUsers,
  FaList,
  FaLayerGroup,
  FaImages,
  FaServicestack,
  FaChartBar,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaFolderOpen,
  FaFolder,
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
    icon: <FaUser />,
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

const AdminMobileSidebar = ({ isOpen, onClose }) => {
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
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}

      <div
        className={`fixed top-0 left-0 w-72 h-screen bg-white z-50 shadow-xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b">
          <Link to="/admin/dashboard" className="cursor-pointer">
            <h2 className="text-2xl font-bold text-purple-600">Album Studio</h2>

            <p className="text-sm text-gray-500">Admin Panel</p>
          </Link>

          <button onClick={onClose}>
            <FaTimes size={22} />
          </button>
        </div>

        {/* Profile */}

        <div className="p-5 border-b">
          <img
            src={admin?.profileImage || "https://i.pravatar.cc/100?img=12"}
            alt={admin?.name || "Admin"}
            className="w-16 h-16 rounded-full object-cover"
          />

          <h3 className="font-semibold mt-3">
            {admin?.name || "Dinkar Paswan"}
          </h3>

          <p className="text-sm text-gray-500">
            {admin?.userType || "Super Admin"}
          </p>
        </div>

        {/* Menu */}

        <div className="flex-1 overflow-y-auto py-3">
          {/* {menus.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-100 text-gray-700"
                }`
              }
            >
              {item.icon}

              <span>{item.name}</span>

            </NavLink>

          ))} */}
          {menus.map((menu, index) => (
            <React.Fragment key={menu.path}>
              {/* Normal Menu */}
              <NavLink
                to={menu.path}
                onClick={onClose}
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
                        onClick={onClose}
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
                        onClick={onClose}
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
                        onClick={onClose}
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
                        onClick={onClose}
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
                        to="/admin/media"
                        onClick={onClose}
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

                      {/* <NavLink
                        to="/admin/albums"
                        onClick={onClose}
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
                      </NavLink> */}

                      <NavLink
                        to="/admin/admininvite"
                        onClick={onClose}
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
                        onClick={onClose}
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
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Logout */}

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-3 transition disabled:opacity-50"
          >
            <FaSignOutAlt />
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminMobileSidebar;
