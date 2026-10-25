import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaCameraRetro,
  FaArrowLeft,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { adminRegister } from "../../app/admin/adminThunk";
import { toast } from "react-toastify";

const AdminRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.admin,
  );
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const onlyNumbers = value.replace(/\D/g, "");

      setFormData({
        ...formData,
        phoneNumber: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Name, email and password are required");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    const result = await dispatch(adminRegister(formData));

    if (adminRegister.fulfilled.match(result)) {
      toast.success("Studio account created successfully! Please login.");

      setTimeout(() => {
        navigate("/");
      }, 1500);

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
      });
    } else {
      toast.error(result.payload?.message || "Registration Failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f6ff]">

      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}

      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-300/20 blur-[120px] animate-pulse" />

      <div
        className="absolute -right-40 bottom-[-150px] h-[550px] w-[550px] rounded-full bg-violet-400/20 blur-[120px]"
        style={{
          animation: "floatBlob 9s ease-in-out infinite",
        }}
      />

      <div
        className="absolute left-[45%] top-[10%] h-32 w-32 rounded-full bg-fuchsia-300/10 blur-3xl"
        style={{
          animation: "floatSmall 6s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT IMAGE SECTION
        ====================================================== */}

        <div className="relative hidden min-h-screen overflow-hidden lg:block">

          {/* Main Image */}

          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&auto=format&fit=crop&q=90"
            alt="Wedding Couple"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              scale-105
              transition-transform
              duration-[10s]
              hover:scale-110
            "
          />

          {/* Dark / Purple Overlay */}

          <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-purple-900/50 to-black/70" />

          {/* Decorative Gradient */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-purple-900/20" />

          <div
            className="
              absolute
              bottom-10
              left-0
              right-0
              max-h-max
              space-y-10
              px-10
              text-center
            "
          >

            {/* Center Content */}

            <div className="max-w-xl text-white mx-auto">

              <div className="mb-5 flex items-center justify-center gap-2">

                <FaCameraRetro className="text-yellow-300" />

                <span className="text-sm font-medium tracking-widest text-purple-200 uppercase">
                  Studio Partner
                </span>

              </div>

              <h1 className="text-5xl font-extrabold leading-tight xl:text-6xl">

                Launch Your
                <br />

                <span className="bg-gradient-to-r from-purple-200 via-white to-pink-200 bg-clip-text text-transparent">
                  Photography Studio
                </span>

                <br />

                Today.

              </h1>

              <p className="mt-7 max-w-lg text-lg leading-relaxed text-purple-100/90 mx-auto">

                Create your studio account and start managing
                your client albums, organize photos and
                videos beautifully.

              </p>

            </div>

            {/* Bottom */}

            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-sm text-purple-200">

              <span>
                © {new Date().getFullYear()} Album Studio
              </span>

              <span>
                Made with 💜 for studios
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            RIGHT REGISTER SECTION
        ====================================================== */}

        <div className="flex min-h-screen items-center justify-center px-5 py-10 md:px-10">

          <div className="w-full max-w-[480px]">

            {/* Mobile Logo */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg">

                <FaCameraRetro />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Album Studio
                </h2>

                <p className="text-xs text-gray-500">
                  Capture • Preserve • Relive
                </p>

              </div>

            </div>

            {/* Back to Home Button */}
            <div className="mb-6 flex items-center justify-between">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-2xl border border-purple-200/80 bg-white/90 px-4 py-2.5 text-xs font-bold text-purple-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 hover:text-white hover:shadow-md hover:shadow-purple-200 hover:-translate-y-0.5"
              >
                <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* =================================================
                REGISTER CARD
            ================================================== */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-white/80
                bg-white/65
                p-6
                shadow-[0_30px_80px_rgba(88,28,135,0.15)]
                backdrop-blur-2xl
                md:p-9
              "
            >

              {/* Card Glow */}

              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-purple-200/30 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl" />

              <div className="relative">

                {/* =================================================
                    HEADING
                ================================================== */}

                <div className="text-center">

                  <div
                    className="
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-purple-500
                      to-violet-600
                      text-white
                      shadow-lg
                      shadow-purple-300/40
                    "
                  >

                    <FaCameraRetro className="text-2xl" />

                  </div>

                  <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-800">

                    Create Studio
                    <br />
                    <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                      Account
                    </span>

                  </h1>

                  <p className="mt-2 text-sm text-gray-500">

                    Register your photography studio

                  </p>

                </div>

                {/* =================================================
                    FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >

                  {/* STUDIO NAME */}

                  <div className="group">

                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Studio Name
                    </label>

                    <div className="relative mt-2">

                      <div
                        className="
                          absolute
                          left-3
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          bg-purple-50
                          text-purple-600
                          transition-all
                          group-focus-within:bg-purple-600
                          group-focus-within:text-white
                        "
                      >

                        <FaUser className="text-sm" />

                      </div>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter studio name"
                        required
                        className="
                          w-full
                          rounded-xl
                          border
                          border-purple-100
                          bg-white/70
                          py-3.5
                          pl-16
                          pr-4
                          text-gray-700
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-gray-400
                          hover:border-purple-200
                          focus:border-purple-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-purple-100
                        "
                      />

                    </div>

                  </div>

                  {/* STUDIO EMAIL */}

                  <div className="group">

                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Studio Email
                    </label>

                    <div className="relative mt-2">

                      <div
                        className="
                          absolute
                          left-3
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          bg-purple-50
                          text-purple-600
                          transition-all
                          group-focus-within:bg-purple-600
                          group-focus-within:text-white
                        "
                      >

                        <FaEnvelope className="text-sm" />

                      </div>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter studio email"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-purple-100
                          bg-white/70
                          py-3.5
                          pl-16
                          pr-4
                          text-gray-700
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-gray-400
                          hover:border-purple-200
                          focus:border-purple-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-purple-100
                        "
                      />

                    </div>

                  </div>

                  {/* PHONE NUMBER */}

                  <div className="group">

                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Phone Number (Optional)
                    </label>

                    <div className="relative mt-2">

                      <div
                        className="
                          absolute
                          left-3
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          bg-purple-50
                          text-purple-600
                          transition-all
                          group-focus-within:bg-purple-600
                          group-focus-within:text-white
                        "
                      >

                        <FaPhoneAlt className="text-sm" />

                      </div>

                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="Enter phone number"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-purple-100
                          bg-white/70
                          py-3.5
                          pl-16
                          pr-4
                          text-gray-700
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-gray-400
                          hover:border-purple-200
                          focus:border-purple-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-purple-100
                        "
                      />

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div className="group">

                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Address (Optional)
                    </label>

                    <div className="relative mt-2">

                      <div
                        className="
                          absolute
                          left-3
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          bg-purple-50
                          text-purple-600
                          transition-all
                          group-focus-within:bg-purple-600
                          group-focus-within:text-white
                        "
                      >

                        <FaMapMarkerAlt className="text-sm" />

                      </div>

                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter studio address"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-purple-100
                          bg-white/70
                          py-3.5
                          pl-16
                          pr-4
                          text-gray-700
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-gray-400
                          hover:border-purple-200
                          focus:border-purple-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-purple-100
                        "
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div className="group">

                    <label className="ml-1 text-sm font-semibold text-gray-700">
                      Password
                    </label>

                    <div className="relative mt-2">

                      <div
                        className="
                          absolute
                          left-3
                          top-1/2
                          flex
                          h-9
                          w-9
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          bg-purple-50
                          text-purple-600
                          transition-all
                          group-focus-within:bg-purple-600
                          group-focus-within:text-white
                        "
                      >

                        <FaLock className="text-sm" />

                      </div>

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="
                          w-full
                          rounded-xl
                          border
                          border-purple-100
                          bg-white/70
                          py-3.5
                          pl-16
                          pr-14
                          text-gray-700
                          outline-none
                          transition-all
                          duration-300
                          placeholder:text-gray-400
                          hover:border-purple-200
                          focus:border-purple-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-purple-100
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
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

                  {/* ERROR */}

                  {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  {/* =================================================
                      REGISTER BUTTON
                  ================================================== */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      group
                      relative
                      w-full
                      overflow-hidden
                      rounded-xl
                      bg-gradient-to-r
                      from-purple-600
                      via-violet-600
                      to-fuchsia-600
                      py-4
                      font-bold
                      text-white
                      shadow-lg
                      shadow-purple-300/40
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      hover:shadow-purple-300/50
                      active:translate-y-0
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >

                    {/* Shine */}

                    {!loading && (
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    )}

                    <span className="relative">

                      {loading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block mr-2" />

                          Creating Account...

                        </>
                      ) : (
                        <>
                          Create Studio Account
                        </>
                      )}

                    </span>

                  </button>

                  {/* BACK TO LOGIN */}

                  <div className="pt-2 text-center">

                    <p className="text-sm text-gray-500">

                      Already have a studio account?{" "}

                      <Link
                        to="/"
                        className="
                          font-bold
                          text-purple-600
                          transition
                          hover:text-purple-800
                          hover:underline
                          inline-flex
                          items-center
                          gap-1
                        "
                      >

                        <FaArrowLeft className="text-xs" />
                        Back to Login

                      </Link>

                    </p>

                  </div>

                </form>

              </div>

            </div>

            {/* Mobile bottom */}

            <p className="mt-6 text-center text-xs text-gray-400 lg:hidden">

              © {new Date().getFullYear()} Album Studio ·
              Capture • Preserve • Relive

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminRegister;
