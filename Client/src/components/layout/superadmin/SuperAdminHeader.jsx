import React from "react";
import { FaBars, FaBell, FaSearch, FaShieldAlt, FaCog } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SuperAdminHeader = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.admin);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-200">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition"
            aria-label="Open sidebar"
          >
            <FaBars className="text-xl" />
          </button>

          <Link
            to="/super-admin/dashboard"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                  Super Admin
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Full platform oversight & management
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="flex items-center w-full bg-gray-100 hover:bg-gray-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500 rounded-xl px-4 py-2 text-sm transition-all border border-transparent focus-within:border-purple-300">
            <FaSearch className="text-gray-400 mr-2.5 text-sm" />
            <input
              type="text"
              placeholder="Quick search admins, clients, events..."
              className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/super-admin/clients?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </div>
        </div>

        {/* Right: Quick actions & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Settings link */}
          <Link
            to="/super-admin/settings"
            title="System Settings"
            className="p-2.5 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition"
          >
            <FaCog className="text-lg" />
          </Link>

          {/* Notifications */}
          <button
            onClick={() => navigate("/admin/notifications")}
            title="Notifications"
            className="relative p-2.5 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition"
          >
            <FaBell className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Profile Card */}
          <div
            onClick={() => navigate("/super-admin/settings")}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-gray-100/80 cursor-pointer transition border border-transparent hover:border-gray-200"
          >
            <img
              src={admin?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
              alt={admin?.name || "Super Admin"}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/20"
            />
            <div className="hidden lg:block text-left">
              <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                {admin?.name || "Super Admin"}
              </h3>
              <p className="text-[11px] font-medium text-purple-600">
                Super Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
