import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaArrowRight,
  FaShieldAlt,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userRegister } from "../../app/auth/authThunk";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    if (location.state?.inviteData) {
      setFormData((prev) => ({
        ...prev,
        name:
          location.state.inviteData.name || "",
        email:
          location.state.inviteData.email || "",
        phoneNumber:
          location.state.inviteData.phoneNumber || "",
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const onlyNumbers =
        value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        phoneNumber: onlyNumbers,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !/^[6-9]\d{9}$/.test(
        formData.phoneNumber
      )
    ) {
      toast.error(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    const payload = {
      ...formData,
      inviteToken:
        location.state?.inviteToken,
    };

    const result = await dispatch(
      userRegister(payload)
    );

    if (userRegister.fulfilled.match(result)) {
      toast.success(
        result.payload.message
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
      });
    } else {
      toast.error(
        result.payload?.message ||
          "Registration Failed"
      );
    }
  };

  const invited =
    !!location.state?.inviteData;

  return (
    <div className="register-page min-h-screen bg-slate-950 lg:grid lg:grid-cols-2">

      {/* =====================================
          LEFT VISUAL
      ===================================== */}

      <div className="relative hidden overflow-hidden lg:flex">

        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400"
          alt="Wedding memories"
          className="
            register-image
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/90 via-indigo-950/70 to-black/80" />

        {/* Floating Orbs */}

        <div
          className="
            register-orb
            absolute
            -left-24
            top-20
            h-72
            w-72
            rounded-full
            bg-purple-500/20
            blur-3xl
          "
        />

        <div
          className="
            register-orb
            register-orb-delay
            absolute
            bottom-10
            right-0
            h-80
            w-80
            rounded-full
            bg-indigo-400/20
            blur-3xl
          "
        />

        {/* Content */}

        <div
          className="
            relative
            z-10
            flex
            w-full
            flex-col
            justify-center
            px-14
            text-white
            xl:px-20
          "
        >

          <div
            className="
              register-logo
              mb-8
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              border
              border-white/20
              bg-white/10
              shadow-2xl
              backdrop-blur-xl
            "
          >
            <FaCamera
              className="
                register-icon
                text-4xl
                text-purple-200
              "
            />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[.3em] text-purple-200">
            Welcome to
          </p>

          <h1
            className="
              text-5xl
              font-black
              tracking-tight
              xl:text-6xl
            "
          >
            Album Studio
          </h1>

          <p
            className="
              mt-6
              max-w-lg
              text-lg
              leading-8
              text-white/75
            "
          >
            Your beautiful memories deserve
            a beautiful place. Create your
            account and keep your albums,
            photos and special moments close.
          </p>


          <div
            className="
              mt-10
              flex
              max-w-lg
              items-center
              gap-4
              rounded-2xl
              border
              border-white/10
              bg-white/10
              p-4
              backdrop-blur-xl
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white/10
              "
            >
              <FaShieldAlt
                className="text-purple-200"
              />
            </div>

            <div>

              <p className="font-semibold">
                Your memories, protected
              </p>

              <p className="mt-1 text-sm text-white/60">
                Secure access to your private
                albums and media.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          RIGHT FORM
      ===================================== */}

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gradient-to-br
          from-slate-50
          via-white
          to-purple-50
          px-4
          py-8
          sm:px-6
          lg:px-10
        "
      >

        <div
          className="
            register-card
            w-full
            max-w-2xl
          "
        >
          {/* Back to Home Button */}
          <div className="mb-4 flex items-center justify-between">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-2xl border border-purple-200/80 bg-white/90 px-4 py-2 text-xs font-bold text-purple-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 hover:text-white hover:shadow-md hover:shadow-purple-200 hover:-translate-y-0.5"
            >
              <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
            >
              <FaHome className="text-xs" />
              <span>Explore Studios</span>
            </Link>
          </div>

          <div
            className="
              rounded-[30px]
              border
              border-white
              bg-white/90
              p-6
            shadow-[0_25px_80px_rgba(76,29,149,0.13)]
            backdrop-blur-xl
            sm:p-9
          "
        >

          {/* Header */}

          <div className="mb-8 text-center">

            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-purple-600
                to-indigo-600
                text-white
                shadow-lg
                shadow-purple-200
              "
            >
              <FaUser className="text-xl" />
            </div>

            <h2
              className="
                text-3xl
                font-black
                tracking-tight
                text-gray-900
                sm:text-4xl
              "
            >
              Create Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start managing your memories
              beautifully.
            </p>

            {invited && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-purple-100
                  bg-purple-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-purple-700
                "
              >
                ✨ Your account details were
                pre-filled from an invitation.
              </div>
            )}

          </div>


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div className="register-field">

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Full Name
              </label>

              <div className="relative">

                <FaUser
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  readOnly={invited}
                  className="
                    register-input
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3.5
                    pl-12
                    pr-4
                    text-sm
                    text-gray-800
                    placeholder:text-gray-400
                    read-only:cursor-not-allowed
                    read-only:bg-gray-100
                  "
                />

              </div>

            </div>


            {/* Phone */}

            <div className="register-field">

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Mobile Number
              </label>

              <div className="relative">

                <FaPhoneAlt
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  required
                  readOnly={invited}
                  className="
                    register-input
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3.5
                    pl-12
                    pr-4
                    text-sm
                    read-only:cursor-not-allowed
                    read-only:bg-gray-100
                  "
                />

              </div>

            </div>


            {/* Email */}

            <div className="register-field">

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Email
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <div className="relative">

                <FaEnvelope
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  readOnly={invited}
                  className="
                    register-input
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3.5
                    pl-12
                    pr-4
                    text-sm
                    read-only:cursor-not-allowed
                    read-only:bg-gray-100
                  "
                />

              </div>

            </div>


            {/* Address */}

            <div className="register-field">

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Address
              </label>

              <div className="relative">

                <FaMapMarkerAlt
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="
                    register-input
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3.5
                    pl-12
                    pr-4
                    text-sm
                  "
                />

              </div>

            </div>


            {/* Password */}

            <div className="register-field">

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Password
              </label>

              <div className="relative">

                <FaLock
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  required
                  className="
                    register-input
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3.5
                    pl-12
                    pr-12
                    text-sm
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    transition
                    hover:text-purple-600
                  "
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>


            {/* Error */}

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-4
                  py-3
                  text-center
                  text-sm
                  font-medium
                  text-red-600
                "
              >
                {error}
              </div>
            )}


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="
                register-button
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-indigo-600
                py-3.5
                font-bold
                text-white
                shadow-lg
                shadow-purple-200
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <span className="relative z-10 flex items-center gap-2">

                {loading
                  ? "Creating Account..."
                  : "Create Account"}

                {!loading && (
                  <FaArrowRight className="text-sm" />
                )}

              </span>

            </button>


            {/* Login */}

            <p className="pt-2 text-center text-sm text-gray-500">

              Already have an account?{" "}

              <Link
                to="/"
                className="
                  font-bold
                  text-purple-600
                  transition
                  hover:text-purple-800
                "
              >
                Login
              </Link>

            </p>

          </form>

        </div>

        </div>

      </div>

    </div>
  );
};

export default Register;