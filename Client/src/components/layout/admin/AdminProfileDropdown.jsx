import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../../app/admin/adminThunk";
import {
  FaUserCircle,
  FaUser,
  FaCog,
  FaBell,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {

        setOpen(false);

      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  return (

    <div
      className="relative"
      ref={dropdownRef}
    >

      {/* Profile */}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3"
      >

        <img
          src="https://i.pravatar.cc/100?img=12"
          alt=""
          className="w-11 h-11 rounded-full object-cover border-2 border-purple-500"
        />

        <div className="hidden lg:block text-left">

          <h3 className="font-semibold">
            Dinkar Paswan
          </h3>

          <p className="text-xs text-gray-500">
            Super Admin
          </p>

        </div>

      </button>

      {/* Dropdown */}

      {open && (

        <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-xl border overflow-hidden z-50">

          {/* Top */}

          <div className="p-5 bg-purple-600 text-white">

            <div className="flex items-center gap-4">

              <img
                src="https://i.pravatar.cc/100?img=12"
                alt=""
                className="w-14 h-14 rounded-full border-2 border-white"
              />

              <div>

                <h2 className="font-bold">
                  Dinkar Paswan
                </h2>

                <p className="text-sm opacity-90">
                  admin@gmail.com
                </p>

              </div>

            </div>

          </div>

          {/* Menu */}

          <div className="py-2">

            <Link
              to="/admin/profile"
              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100"
            >

              <FaUser className="text-purple-600" />

              My Profile

            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100"
            >

              <FaCog className="text-blue-600" />

              Settings

            </Link>

            <Link
              to="/admin/notifications"
              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100"
            >

              <FaBell className="text-yellow-500" />

              Notifications

            </Link>

            <Link
              to="/admin/change-password"
              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100"
            >

              <FaLock className="text-green-600" />

              Change Password

            </Link>

          </div>

          {/* Logout */}

          <div className="border-t p-3">

            <button
              onClick={async () => {
                await dispatch(adminLogout());
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
            >

              <FaSignOutAlt />

              Logout

            </button>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminProfileDropdown;