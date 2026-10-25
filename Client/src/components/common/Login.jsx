// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import { adminLogin } from "../../app/admin/adminThunk";
// import { userLogin } from "../../app/auth/authThunk";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaCamera,
//   FaCameraRetro,
// } from "react-icons/fa";
// import { toast } from "react-toastify";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const adminState = useSelector((state) => state.admin);
//   const userState = useSelector((state) => state.auth);

//   const [loginType, setLoginType] = useState("User");

//   const [formData, setFormData] = useState({
//     phoneNumber: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (loginType === "User") {
//       if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
//         toast.error("Please enter a valid 10-digit mobile number.");
//         return;
//       }
//     }

//     const action =
//       loginType === "Admin"
//         ? adminLogin({
//             email: formData.email,
//             password: formData.password,
//           })
//         : userLogin({
//             phoneNumber: formData.phoneNumber,
//             password: formData.password,
//           });

//     const result = await dispatch(action);

//     if (result.type.endsWith("/rejected")) {
//       const errorMessage =
//         result.payload?.message ||
//         result.payload ||
//         result.error?.message ||
//         "Invalid credentials";
//       toast.error(errorMessage);
//     }
//   };

//   useEffect(() => {
//     if (adminState.isAuthenticated) {
//       navigate("/admin/dashboard");
//     }

//     if (userState.token) {
//       navigate("/user/dashboard");
//     }
//   }, [adminState.isAuthenticated, userState.token, navigate]);

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* Left Side */}

//       <div className="hidden lg:flex relative">
//         <img
//           src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400"
//           alt="Login"
//           className="w-full h-full object-cover"
//         />

//         <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white px-10">
//           <FaCamera className="text-7xl mb-6" />

//           <h1 className="text-5xl font-bold">Album Studio</h1>

//           <p className="mt-6 text-center text-lg max-w-md">
//             Welcome back! Login to access your albums, memories and downloads.
//           </p>
//         </div>
//       </div>

//       {/* Right Side */}

//       <div className="flex items-center justify-center bg-gray-50 px-6 py-10">
//         <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-8">
//           <div className="text-center">
//             <h2 className="text-4xl font-bold">Login</h2>

//             <p className="text-gray-500 mt-2">
//               {loginType === "User"
//                 ? "Login using your mobile number"
//                 : "Login using your email address"}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//             {/* Login Type */}

//             {/* <div>

//               <label className="font-semibold">
//                 Login As
//               </label>

//               <select
//                 name="loginType"
//                 value={formData.loginType}
//                 onChange={handleChange}
//                 className="w-full border rounded-xl py-3 px-4 mt-2 outline-none focus:ring-2 focus:ring-purple-600"
//               >
//                 <option value="User">
//                   User
//                 </option>

//                 <option value="Admin">
//                   Admin
//                 </option>

//               </select>

//             </div> */}

//             <div className="mt-6">
//               <div className="flex bg-gray-100 rounded-xl p-1">
//                 <button
//                   type="button"
//                   onClick={() => setLoginType("User")}
//                   className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                     loginType === "User"
//                       ? "bg-purple-600 text-white shadow"
//                       : "text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   👤 User
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setLoginType("Admin")}
//                   className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                     loginType === "Admin"
//                       ? "bg-purple-600 text-white shadow"
//                       : "text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {/* 🛡 Admin */}
//                   <FaCameraRetro className="inline mr-2" />
//                   Studio
//                 </button>
//               </div>
//             </div>

//             {/* User Login */}

//             {loginType === "User" ? (
//               <div>
//                 <label className="font-semibold">Mobile Number</label>

//                 <div className="relative mt-2">
//                   <FaPhoneAlt className="absolute left-4 top-4 text-gray-400" />

//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     placeholder="Enter Mobile Number"
//                     maxLength={10}
//                     required
//                     // pattern="[6-9]{1}[0-9]{9}"
//                     className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple-600"
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <label className="font-semibold">Email Address</label>

//                 <div className="relative mt-2">
//                   <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter Email Address"
//                     className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-purple-600"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Password */}

//             <div>
//               <label className="font-semibold">Password</label>

//               <div className="relative mt-2">
//                 <FaLock className="absolute left-4 top-4 text-gray-400" />

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter Password"
//                   required
//                   className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-purple-600"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-4 text-gray-500"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {/* Forgot Password */}

//             <div className="text-right">
//               <Link
//                 to={
//                   loginType === "Admin"
//                     ? "/forgot-password"
//                     : "/forgot-password"
//                 }
//                 className="text-purple-600 hover:underline text-sm"
//               >
//                 Forgot Password?
//               </Link>
//             </div>

//             {loginType === "Admin" ? (
//               adminState.error && (
//                 <p className="text-red-500 text-sm text-center">
//                   {adminState.error}
//                 </p>
//               )
//             ) : (
//               userState.error && (
//                 <p className="text-red-500 text-sm text-center">
//                   {userState.error}
//                 </p>
//               )
//             )}

//             {/* Login */}

//             <button
//               type="submit"
//               disabled={
//                 loginType === "Admin" ? adminState.loading : userState.loading
//               }
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
//             >
//               {loginType === "Admin"
//                 ? adminState.loading
//                   ? "Logging..."
//                   : "Admin Login"
//                 : userState.loading
//                   ? "Logging..."
//                   : "User Login"}
//             </button>

//             {/* Register */}

// {loginType === "User" && (
//   <div className="text-center mt-2">
//     <p className="text-gray-600">
//       Don't have an account?{" "}
//       <Link
//         to="/users/register"
//         className="text-purple-600 font-semibold hover:underline"
//       >
//         Register
//       </Link>
//     </p>
//   </div>
// )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { adminLogin } from "../../app/admin/adminThunk";
import { userLogin } from "../../app/auth/authThunk";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaCameraRetro,
  FaHeart,
  FaArrowRight,
  FaShieldAlt,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";

import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminState = useSelector((state) => state.admin);
  const userState = useSelector((state) => state.auth);

  const [loginType, setLoginType] = useState("User");

  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginType === "User") {
      if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
        toast.error("Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    const action =
      loginType === "User"
        ? userLogin({
            phoneNumber: formData.phoneNumber,
            password: formData.password,
          })
        : adminLogin({
            email: formData.email,
            password: formData.password,
          });

    const result = await dispatch(action);

    if (result.type.endsWith("/rejected")) {
      const errorMessage =
        result.payload?.message ||
        result.payload ||
        result.error?.message ||
        "Invalid credentials";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const expiredType = sessionStorage.getItem("sessionExpiredType");
    if (expiredType === "Admin") {
      setLoginType("Admin");
      sessionStorage.removeItem("sessionExpiredType");
    }

    if (sessionStorage.getItem("sessionExpired")) {
      toast.error("Your session has expired. Please login again.");
      sessionStorage.removeItem("sessionExpired");
    }
  }, []);

  useEffect(() => {
    if (adminState.isAuthenticated && adminState.admin?.userType === "SuperAdmin") {
      navigate("/super-admin/dashboard");
      return;
    }

    if (adminState.isAuthenticated && adminState.admin?.userType === "Admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (userState.token) {
      navigate("/user/dashboard");
    }
  }, [adminState.isAuthenticated, adminState.admin, userState.token, navigate]);

  const isLoading =
    loginType === "User" ? userState.loading : adminState.loading;

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

      {/* Floating dots */}

      <div
        className="absolute left-[8%] top-[30%] h-3 w-3 rounded-full bg-purple-500/30"
        style={{
          animation: "floatSmall 5s ease-in-out infinite",
        }}
      />

      <div
        className="absolute right-[12%] top-[20%] h-4 w-4 rounded-full bg-violet-500/30"
        style={{
          animation: "floatSmall 7s ease-in-out infinite reverse",
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


          {/* Floating Heart */}

          <div
            className="
              absolute
              right-16
              top-20
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-white/20
              bg-white/10
              text-white
              shadow-xl
              backdrop-blur-xl
            "
            style={{
              animation: "floating 4s ease-in-out infinite",
            }}
          >
            <FaHeart className="text-xl text-pink-300" />
          </div>


          {/* Main Content */}

          <div className="relative z-10 flex min-h-screen flex-col justify-between px-12 py-12 xl:px-20">

            {/* Logo & Back to Home Button */}

            <div className="flex items-center justify-between text-white">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">

                  <FaCamera className="text-xl" />

                </div>

                <div>

                  <h2 className="text-xl font-bold tracking-wide">
                    Album Studio
                  </h2>

                  <p className="text-xs text-purple-200">
                    Capture • Preserve • Relive
                  </p>

                </div>

              </div>

              <Link
                to="/"
                className="group flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition hover:bg-white hover:text-purple-900 shadow-md"
              >
                <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>

            </div>


            {/* Center Content */}

            <div className="max-w-xl text-white">

              <div className="mb-5 flex items-center gap-2">

                <FaHeart className="text-yellow-300" />

                <span className="text-sm font-medium tracking-widest text-purple-200 uppercase">
                  Your memories matter
                </span>

              </div>


              <h1 className="text-5xl font-extrabold leading-tight xl:text-6xl">

                Every Moment
                <br />

                <span className="bg-gradient-to-r from-purple-200 via-white to-pink-200 bg-clip-text text-transparent">
                  Deserves To Be
                </span>

                <br />

                Remembered.

              </h1>


              <p className="mt-7 max-w-lg text-lg leading-relaxed text-purple-100/90">

                Welcome back to your personal digital album.
                Access your beautiful photographs, videos and
                unforgettable memories — all in one place.

              </p>


              {/* Feature Pills */}

              <div className="mt-8 flex flex-wrap gap-3">

                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                  📸 Premium Photos
                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                  🎥 4K Videos
                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                  💜 Digital Albums
                </div>

              </div>

            </div>


            {/* Bottom */}

            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-sm text-purple-200">

              <span>
                © {new Date().getFullYear()} Album Studio
              </span>

              <span className="flex items-center gap-2">

                Made with

                <FaHeart className="text-pink-300" />

                for memories

              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT LOGIN SECTION
        ====================================================== */}

        <div className="flex min-h-screen items-center justify-center px-5 py-10 md:px-10">

          <div className="w-full max-w-[480px]">

            {/* Back to Home Navigation */}

            <div className="mb-6 flex items-center justify-between">

              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-2xl border border-purple-200/80 bg-white/90 px-4 py-2.5 text-xs font-bold text-purple-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 hover:text-white hover:shadow-md hover:shadow-purple-200 hover:-translate-y-0.5"
              >
                <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>

              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
              >
                <FaHome className="text-xs" />
                <span>Explore Studios</span>
              </Link>

            </div>

            {/* Mobile Logo */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg">

                <FaCamera />

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


            {/* =================================================
                LOGIN CARD
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

                    {loginType === "User" ? (
                      <FaCamera className="text-2xl" />
                    ) : (
                      <FaCameraRetro className="text-2xl" />
                    )}

                  </div>


                  <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-800">

                    Welcome{" "}

                    <span className="bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                      Back
                    </span>

                  </h1>


                  <p className="mt-2 text-sm text-gray-500">

                    {loginType === "User"
                      ? "Login to access your memories & albums"
                      : loginType === "SuperAdmin"
                        ? "Super admin access for full website control"
                        : "Studio access for managing your albums"}

                  </p>

                </div>


                {/* =================================================
                    USER / STUDIO SWITCH
                ================================================== */}

                <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/60 p-1.5">

                  <div className="grid grid-cols-3 gap-1">

                    <button
                      type="button"
                      onClick={() => {
                        setLoginType("User");
                        setShowPassword(false);
                      }}
                      className={`
                        relative
                        overflow-hidden
                        rounded-xl
                        py-3
                        font-semibold
                        transition-all
                        duration-300
                        ${
                          loginType === "User"
                            ? "bg-white text-purple-700 shadow-md"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      `}
                    >

                      <span className="relative z-10">
                        👤 User
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginType("Admin");
                        setShowPassword(false);
                      }}
                      className={`
                        relative
                        overflow-hidden
                        rounded-xl
                        py-3
                        font-semibold
                        transition-all
                        duration-300
                        ${
                          loginType === "Admin"
                            ? "bg-white text-purple-700 shadow-md"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      `}
                    >

                      <span className="relative z-10 flex items-center justify-center gap-2">

                        <FaCameraRetro />

                        Studio

                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginType("SuperAdmin");
                        setShowPassword(false);
                      }}
                      className={`
                        relative
                        overflow-hidden
                        rounded-xl
                        py-3
                        font-semibold
                        transition-all
                        duration-300
                        ${
                          loginType === "SuperAdmin"
                            ? "bg-white text-purple-700 shadow-md"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      `}
                    >

                      <span className="relative z-10 flex items-center justify-center gap-2">

                        <FaShieldAlt />

                        Super

                      </span>

                    </button>

                  </div>

                </div>


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >


                  {/* USER PHONE */}

                  {loginType === "User" ? (

                    <div className="group">

                      <label className="ml-1 text-sm font-semibold text-gray-700">
                        Mobile Number
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
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
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

                  ) : (

                    <div className="group">

                      <label className="ml-1 text-sm font-semibold text-gray-700">
                        {loginType === "SuperAdmin" ? "Super Admin Email" : "Studio Email"}
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
                          placeholder={loginType === "SuperAdmin" ? "Enter super admin email" : "Enter studio email"}
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

                  )}


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


                  {/* FORGOT PASSWORD */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-xs text-gray-400">

                      <FaShieldAlt className="text-green-500" />

                      Secure Login

                    </div>


                    <Link
                      to="/forgot-password"
                      className="
                        text-sm
                        font-semibold
                        text-purple-600
                        transition
                        hover:text-purple-800
                        hover:underline
                      "
                    >

                      Forgot Password?

                    </Link>

                  </div>


                  {/* ERROR */}

                  {loginType === "Admin"
                    ? adminState.error && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-500">
                          {adminState.error}
                        </div>
                      )
                    : userState.error && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-500">
                          {userState.error}
                        </div>
                      )}


                  {/* =================================================
                      LOGIN BUTTON
                  ================================================== */}

                  <button
                    type="submit"
                    disabled={isLoading}
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

                    {!isLoading && (
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    )}


                    <span className="relative flex items-center justify-center gap-3">

                      {isLoading ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Logging in...

                        </>
                      ) : (
                        <>
                          {loginType === "Admin"
                            ? "Studio Login"
                            : loginType === "SuperAdmin"
                              ? "Super Admin Login"
                              : "Login to My Album"}

                          <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

                        </>
                      )}

                    </span>

                  </button>


                  {/* REGISTER */}

                  {loginType === "User" && (

                    <div className="pt-2 text-center">

                      <p className="text-sm text-gray-500">

                        Don't have an account?{" "}

                        <Link
                          to="/users/register"
                          className="
                            font-bold
                            text-purple-600
                            transition
                            hover:text-purple-800
                            hover:underline
                          "
                        >

                          Create Account

                        </Link>

                      </p>

                    </div>

                  )}

                  {/* STUDIO REGISTER */}

                  {loginType === "Admin" && (

                    <div className="pt-2 text-center">

                      <p className="text-sm text-gray-500">

                        Don't have a studio account?{" "}

                        <Link
                          to="/admin/register"
                          className="
                            font-bold
                            text-purple-600
                            transition
                            hover:text-purple-800
                            hover:underline
                          "
                        >

                          Create Studio Account

                        </Link>

                      </p>

                    </div>

                  )}


                  {/* Bottom text */}

                  <div className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-400">

                    <span className="h-px w-10 bg-gray-200" />

                    <FaHeart className="text-purple-300" />

                    <span>
                      Your memories are safe with us
                    </span>

                    <FaHeart className="text-purple-300" />

                    <span className="h-px w-10 bg-gray-200" />

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


      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style>{`

        @keyframes floating {

          0% {
            transform: translateY(0px) rotate(0deg);
          }

          50% {
            transform: translateY(-15px) rotate(5deg);
          }

          100% {
            transform: translateY(0px) rotate(0deg);
          }

        }


        @keyframes floatingSmall {

          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-20px);
          }

          100% {
            transform: translateY(0px);
          }

        }


        @keyframes floatBlob {

          0% {
            transform: translate(0px, 0px);
          }

          50% {
            transform: translate(-25px, -25px);
          }

          100% {
            transform: translate(0px, 0px);
          }

        }

      `}</style>

    </div>
  );
};

export default Login;
