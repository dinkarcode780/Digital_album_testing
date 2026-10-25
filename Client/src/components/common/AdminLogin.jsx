import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Admin Login API
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8">

        {/* Logo */}

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">

            <FaUserShield className="text-4xl text-purple-600" />

          </div>

        </div>

        {/* Heading */}

        <div className="text-center mt-6">

          <h1 className="text-3xl font-bold">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to access the Admin Panel
          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-8"
        >

          {/* Email */}

          <div>

            <label className="font-semibold">
              Email Address
            </label>

            <div className="relative mt-2">

              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple-600"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="font-semibold">
              Password
            </label>

            <div className="relative mt-2">

              <FaLock className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-purple-600"
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

          {/* Forgot Password */}

          <div className="flex justify-end">

            <Link
              to="/admin/forgot-password"
              className="text-purple-600 hover:underline text-sm"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Button */}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>

        </form>

        {/* Back */}

        <div className="text-center mt-8">

          <Link
            to="/"
            className="text-gray-500 hover:text-purple-600"
          >
            ← Back to Website
          </Link>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;