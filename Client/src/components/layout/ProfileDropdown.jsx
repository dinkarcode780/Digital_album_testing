import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../app/auth/authThunk";
import {
  FaUserCircle,
  FaUser,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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

  const handleLogout = async () => {
    setOpen(false);
    await dispatch(userLogout());
    navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer focus:outline-none"
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-purple-500"
          />
        ) : (
          <FaUserCircle size={32} className="text-gray-600 hover:text-purple-600 transition" />
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-150 overflow-hidden z-50">
          {/* User Details */}
          <div className="p-4 bg-purple-600 text-white">
            <h4 className="font-semibold truncate">{user?.name || "User"}</h4>
            <p className="text-xs opacity-90 truncate">{user?.email || ""}</p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <FaUser className="text-purple-600" />
              My Profile
            </Link>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <FaKey className="text-green-600" />
              Change Password
            </Link>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer font-medium"
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

export default ProfileDropdown;