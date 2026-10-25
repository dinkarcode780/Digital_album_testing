import React from "react";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";


const AdminNav = ({ setSidebarOpen }) => {
 
  const { admin } = useSelector((state) => state.admin);
  
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">

      <div className="h-16 px-6 flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-4">

          {/* Mobile Menu */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-2xl"
          >
            <FaBars />
          </button>

          <h1 className="text-2xl font-bold text-gray-800">
            Admin Panel
          </h1>

        </div>

        {/* Search */}

        <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-[350px]">

          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent ml-3 w-full outline-none"
          />

        </div>

        {/* Right */}

        <div className="flex items-center gap-6">

          {/* Notification */}

          <button className="relative">

            <FaBell className="text-2xl text-gray-600 hover:text-purple-600 transition" />

            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              6no
            </span>

          </button>

          {/* Profile */}

          <div
          className="flex items-center gap-3  cursor-pointer">
          
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt=""
              className="w-11 h-11 rounded-full border object-cover"
            />

            <Link to="/admin/profile" className="hidden md:block">

              <h3 className="font-semibold">
                {admin?.name || "Dinkar Paswan"}
              </h3>

              <p className="text-sm text-gray-500">
                {admin?.userType || "Super Admin"}
              </p>

            </Link>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminNav;