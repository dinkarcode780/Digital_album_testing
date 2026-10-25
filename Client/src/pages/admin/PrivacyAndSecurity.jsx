import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaLock,
  FaShieldAlt,
  FaKey,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { userChangePassword } from "../../app/auth/authThunk";

const PrivacyAndSecurity = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return false;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return false;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    const result = await dispatch(
      userChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    );

    if (userChangePassword.fulfilled.match(result)) {
      toast.success(result.payload.message || "Password updated successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.payload?.message || "Unable to change password.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Privacy & Security
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your account security and password.
        </p>

      </div>

      {/* Security Card */}

      <div className="bg-white rounded-2xl shadow p-8">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">

            <FaShieldAlt className="text-2xl text-purple-600" />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Change Password
            </h2>

            <p className="text-gray-500">
              Keep your account secure by changing your password regularly.
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Current Password */}

          <div>

            <label className="font-semibold">
              Current Password
            </label>

            <div className="relative mt-2">

              <FaLock className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* New Password */}

          <div>

            <label className="font-semibold">
              New Password
            </label>


            <div className="relative mt-2">

              <FaKey className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label className="font-semibold">
              Confirm Password
            </label>

            <div className="relative mt-2">

              <FaKey className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

          </div>

          {/* Password Rules */}

          <div className="bg-gray-50 rounded-xl p-5">

            <h3 className="font-semibold mb-3">
              Password Requirements
            </h3>

            <ul className="text-sm text-gray-600 space-y-2">

              <li>✔ Minimum 8 characters</li>

              <li>✔ At least one uppercase letter</li>

              <li>✔ At least one lowercase letter</li>

              <li>✔ At least one number</li>

              <li>✔ At least one special character</li>

            </ul>

          </div>

          {/* Button */}

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Update Password
          </button>

        </form>

      </div>

    </div>
  );
};

export default PrivacyAndSecurity;