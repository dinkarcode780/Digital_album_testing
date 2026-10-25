import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../../app/admin/adminThunk";
import { superAdminMenus } from "./SuperAdminSidebar";

const SuperAdminMobileSidebar = ({ isOpen, onClose }) => {
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <FaShieldAlt className="text-lg" />
            </div>
            <Link to="/super-admin/dashboard" onClick={onClose}>
              <h1 className="text-xl font-black bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                Album Studio
              </h1>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                Super Admin
              </p>
            </Link>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="py-4 px-6 border-b bg-purple-50/50 flex items-center gap-3">
          <img
            src={admin?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
            alt={admin?.name || "Super Admin"}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-500/30"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm text-gray-800 truncate">
              {admin?.name || "Super Admin"}
            </h2>
            <div className="flex items-center gap-1 text-purple-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Super Administrator</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Navigation Menu
          </div>

          {superAdminMenus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-purple-500/20"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${isActive ? "text-white" : "text-gray-500"}`}>
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
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminMobileSidebar;
