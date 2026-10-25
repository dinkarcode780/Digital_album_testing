import React from "react";
import { FaBars, FaBell, FaSearch, FaEnvelope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.admin);
  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left */}

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-2xl"
          >
            <FaBars />
          </button>

          <Link to="/admin/dashboard" className="cursor-pointer">
            <h2 className="text-2xl font-bold">Dashboard</h2>

            <p className="text-sm text-gray-500">
              Welcome back, {admin?.name || "Admin"} 👋
            </p>
          </Link>
        </div>

        {/* Search */}

        <div className="hidden lg:flex items-center w-[380px] bg-gray-100 rounded-xl px-4 py-3">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search anything..."
            className="ml-3 bg-transparent outline-none w-full"
          />
        </div>

        {/* Right */}

        <div className="flex items-center gap-5">
          {/* Mail */}

          <button className="relative">
            <FaEnvelope className="text-xl text-gray-600 hover:text-purple-600 transition" />

            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex justify-center items-center">
              2
            </span>
          </button>

          {/* Notification */}

          <button
            onClick={() => {
              navigate("/admin/notifications");
            }}
            className="relative cursor-pointer"
          >
            <FaBell className="text-xl text-gray-600 hover:text-purple-600 transition" />

            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex justify-center items-center">
              5
            </span>
          </button>

          {/* Profile */}

          <div
            onClick={() => {
              console.log("Clicked");
              navigate("/admin/profile");
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={admin?.profileImage || "https://i.pravatar.cc/100?img=12"}
              alt={admin?.name || "Admin"}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="hidden md:block">
              <h3 className="font-semibold">{admin?.name}</h3>

              <p className="text-xs text-gray-500">
                {admin?.userType || "Super Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
