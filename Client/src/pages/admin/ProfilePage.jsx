// import React, { useEffect, useState } from "react";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhoneAlt,
//   FaMapMarkerAlt,
//   FaCamera,
//   FaSave,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getAdminById, adminUpdateProfile } from "../../app/admin/adminThunk";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { admin, loading } = useSelector((state) => state.admin);

//   const [formData, setFormData] = useState({
//     adminId: "",
//     name: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     profileImage: null,
//   });

//   useEffect(() => {
//     const adminData = JSON.parse(localStorage.getItem("admin"));

//     if (adminData?._id) {
//       dispatch(getAdminById(adminData._id));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (admin) {
//       setFormData({
//         adminId: admin._id,
//         name: admin.name || "",
//         email: admin.email || "",
//         phoneNumber: admin.phoneNumber || "",
//         address: admin.address || "",
//         profileImage: null,
//       });
//     }
//   }, [admin]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImage = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       profileImage: e.target.files[0],
//     }));
//   };

//   const handleSubmit = () => {
//     dispatch(adminUpdateProfile(formData));
//   };

//   if (loading) {
//     return <div className="text-center text-xl py-20">Loading...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Admin Profile</h1>

//         <p className="text-gray-500 mt-2">
//           Manage your personal information and account settings.
//         </p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Left */}

//         <div className="bg-white rounded-2xl shadow p-8 text-center">
//           <div className="relative w-40 h-40 mx-auto">
//             <img
//               src={
//                 formData.profileImage
//                   ? URL.createObjectURL(formData.profileImage)
//                   : admin?.profileImage || "https://i.pravatar.cc/300?img=12"
//               }
//               className="w-full h-full rounded-full object-cover border-4 border-purple-100"
//               alt=""
//             />

//             <label className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer">
//               <FaCamera />

//               <input
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={handleImage}
//               />
//             </label>
//           </div>

//           <h2 className="text-2xl font-bold mt-6">{admin?.name}</h2>

//           <p className="text-gray-500">{admin?.userType || "Super Admin"}</p>

//           <span className="inline-block mt-3 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm">
//             Active Account
//           </span>

//           <button
//             onClick={() => navigate("/admin/resetpassword")}
//             className="mt-6 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl transition"
//           >
//             Reset Password
//           </button>
//         </div>

//         {/* Right */}

//         <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">
//           <h2 className="text-2xl font-bold mb-8">Personal Information</h2>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="font-semibold flex items-center gap-2">
//                 <FaUser className="text-purple-600" />
//                 Full Name
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full border rounded-xl p-3 mt-2"
//               />
//             </div>

//             <div>
//               <label className="font-semibold flex items-center gap-2">
//                 <FaEnvelope className="text-purple-600" />
//                 Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border rounded-xl p-3 mt-2"
//               />
//             </div>

//             <div>
//               <label className="font-semibold flex items-center gap-2">
//                 <FaPhoneAlt className="text-purple-600" />
//                 Phone Number
//               </label>

//               <input
//                 type="text"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className="w-full border rounded-xl p-3 mt-2"
//               />
//             </div>

//             <div>
//               <label className="font-semibold flex items-center gap-2">
//                 <FaMapMarkerAlt className="text-purple-600" />
//                 Address
//               </label>

//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full border rounded-xl p-3 mt-2"
//               />
//             </div>
//           </div>

//           {/* <div className="mt-6">
//             <label className="font-semibold">About</label>

//             <textarea
//               rows="5"
//               defaultValue="Professional Wedding Studio Administrator."
//               className="w-full border rounded-xl p-3 mt-2 resize-none outline-none focus:ring-2 focus:ring-purple-500"
//             ></textarea>
//           </div> */}

//           <div className="mt-8 flex justify-end">
//             <button
//               onClick={handleSubmit}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-3"
//             >
//               <FaSave />
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaSave,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
  FaCalendarAlt,
  FaEdit,
  FaArrowRight,
  FaBuilding,
  FaUserShield,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminById,
  adminUpdateProfile,
} from "../../app/admin/adminThunk";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin, loading } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    adminId: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImage: null,
  });

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));

    if (adminData?._id) {
      dispatch(getAdminById(adminData._id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (admin) {
      setFormData({
        adminId: admin._id,
        name: admin.name || "",
        email: admin.email || "",
        phoneNumber: admin.phoneNumber || "",
        address: admin.address || "",
        profileImage: null,
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
  };

  const handleSubmit = () => {
    dispatch(adminUpdateProfile(formData));
  };

  const profilePreview = formData.profileImage
    ? URL.createObjectURL(formData.profileImage)
    : admin?.profileImage || "https://i.pravatar.cc/300?img=12";

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#faf8ff] to-[#eee8ff]">

        <div className="text-center">

          <div className="relative mx-auto h-16 w-16">

            <div className="absolute inset-0 rounded-full border-4 border-purple-200" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-purple-600" />

          </div>

          <p className="mt-5 font-semibold text-gray-600">
            Loading admin profile...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#faf8ff] via-[#f6f1ff] to-[#eee7ff] px-4 py-8 md:px-8">

      {/* =====================================================
          BACKGROUND ANIMATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-purple-300/20 blur-[120px] animate-pulse" />

      <div
        className="pointer-events-none absolute -right-40 top-[15%] h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[120px]"
        style={{
          animation: "adminBlob 9s ease-in-out infinite",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-[-180px] left-[35%] h-[450px] w-[450px] rounded-full bg-fuchsia-300/15 blur-[120px]"
        style={{
          animation: "adminBlob 11s ease-in-out infinite reverse",
        }}
      />

      {/* Floating dots */}

      <div
        className="absolute left-[8%] top-[30%] h-3 w-3 rounded-full bg-purple-500/30"
        style={{
          animation: "adminFloat 5s ease-in-out infinite",
        }}
      />

      <div
        className="absolute right-[12%] top-[25%] h-4 w-4 rounded-full bg-violet-500/30"
        style={{
          animation: "adminFloat 7s ease-in-out infinite reverse",
        }}
      />


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">

            <FaUserShield />

            Studio Administration

          </div>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-800 md:text-5xl">

            Admin{" "}

            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Profile
            </span>

          </h1>

          <p className="mt-2 text-gray-500">
            Manage your studio profile and account information.
          </p>

        </div>


        {/* =====================================================
            PROFILE HERO
        ====================================================== */}

        <div className="relative mb-8 overflow-hidden rounded-[32px] border border-white/80 bg-white/60 shadow-[0_25px_80px_rgba(109,40,217,0.12)] backdrop-blur-2xl">

          {/* Decorative gradient */}

          <div className="absolute right-[-100px] top-[-120px] h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="absolute bottom-[-140px] left-[30%] h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 p-7 md:flex-row md:items-center md:p-10">

            {/* PROFILE IMAGE */}

            <div className="relative mx-auto flex-shrink-0 md:mx-0">

              {/* Animated ring */}

              <div
                className="absolute -inset-3 rounded-full border border-purple-300/40"
                style={{
                  animation: "adminRotate 8s linear infinite",
                }}
              />

              {/* Second ring */}

              <div
                className="absolute -inset-5 rounded-full border border-dashed border-purple-200/50"
                style={{
                  animation: "adminRotate 14s linear infinite reverse",
                }}
              />

              {/* Image */}

              <div className="rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-500 p-1.5 shadow-2xl shadow-purple-300/30">

                <img
                  src={profilePreview}
                  alt={admin?.name || "Admin"}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover md:h-36 md:w-36"
                />

              </div>


              {/* Camera */}

              <label className="absolute bottom-1 right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-4 border-white bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg transition-all duration-300 hover:scale-110">

                <FaCamera />

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                />

              </label>


              {/* Active */}

              <div className="absolute left-1 top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-500 text-white shadow-md">

                <FaCheckCircle className="text-xs" />

              </div>

            </div>


            {/* ADMIN INFO */}

            <div className="flex-1 text-center md:text-left">

              <div className="flex flex-col items-center gap-3 md:flex-row">

                <h2 className="text-3xl font-extrabold text-gray-800">
                  {admin?.name || "Studio Administrator"}
                </h2>

                <span className="rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold text-purple-700">

                  {admin?.userType || "Super Admin"}

                </span>

              </div>


              <p className="mt-2 text-gray-500">
                Manage your Digital Album studio from one secure account.
              </p>


              {/* Contact */}

              <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">

                <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-gray-600 shadow-sm backdrop-blur-md">

                  <FaEnvelope className="text-purple-500" />

                  {admin?.email || "admin@albumstudio.com"}

                </div>


                <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-gray-600 shadow-sm backdrop-blur-md">

                  <FaPhoneAlt className="text-purple-500" />

                  {admin?.phoneNumber || "+91 9876543210"}

                </div>

              </div>

            </div>


            {/* SECURITY */}

            <div className="hidden rounded-2xl border border-green-100 bg-green-50/80 p-5 text-center md:block">

              <FaShieldAlt className="mx-auto text-2xl text-green-500" />

              <p className="mt-2 text-sm font-bold text-green-700">
                Account Secure
              </p>

              <p className="mt-1 text-xs text-green-600">
                Protected
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-110">

                <FaBuilding />

              </div>

              <div>

                <p className="text-lg font-extrabold text-gray-800">
                  Studio
                </p>

                <p className="text-xs text-gray-500">
                  Account Type
                </p>

              </div>

            </div>

          </div>


          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-transform group-hover:scale-110">

                <FaCheckCircle />

              </div>

              <div>

                <p className="text-lg font-extrabold text-green-600">
                  Active
                </p>

                <p className="text-xs text-gray-500">
                  Status
                </p>

              </div>

            </div>

          </div>


          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">

                <FaCalendarAlt />

              </div>

              <div>

                <p className="text-lg font-extrabold text-gray-800">
                  2026
                </p>

                <p className="text-xs text-gray-500">
                  Member Since
                </p>

              </div>

            </div>

          </div>


          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition-transform group-hover:scale-110">

                <FaShieldAlt />

              </div>

              <div>

                <p className="text-lg font-extrabold text-gray-800">
                  Secure
                </p>

                <p className="text-xs text-gray-500">
                  Protection
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">


          {/* =================================================
              PERSONAL INFORMATION
          ================================================== */}

          <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-2xl md:p-8">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your studio administrator details
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                <FaEdit />

              </div>

            </div>


            <div className="grid gap-6 md:grid-cols-2">


              {/* NAME */}

              <div className="group">

                <label className="ml-1 flex items-center gap-2 text-sm font-semibold text-gray-700">

                  <FaUser className="text-purple-500" />

                  Full Name

                </label>

                <div className="relative mt-2">

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-purple-100
                      bg-white/70
                      px-4
                      py-3.5
                      text-gray-700
                      outline-none
                      transition-all
                      duration-300
                      hover:border-purple-200
                      focus:border-purple-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                    placeholder="Enter full name"
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="group">

                <label className="ml-1 flex items-center gap-2 text-sm font-semibold text-gray-700">

                  <FaEnvelope className="text-purple-500" />

                  Email Address

                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-purple-100
                    bg-white/70
                    px-4
                    py-3.5
                    text-gray-700
                    outline-none
                    transition-all
                    duration-300
                    hover:border-purple-200
                    focus:border-purple-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-purple-100
                  "
                  placeholder="Enter email address"
                />

              </div>


              {/* PHONE */}

              <div className="group">

                <label className="ml-1 flex items-center gap-2 text-sm font-semibold text-gray-700">

                  <FaPhoneAlt className="text-purple-500" />

                  Phone Number

                </label>

                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-purple-100
                    bg-white/70
                    px-4
                    py-3.5
                    text-gray-700
                    outline-none
                    transition-all
                    duration-300
                    hover:border-purple-200
                    focus:border-purple-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-purple-100
                  "
                  placeholder="Enter phone number"
                />

              </div>


              {/* ADDRESS */}

              <div className="group">

                <label className="ml-1 flex items-center gap-2 text-sm font-semibold text-gray-700">

                  <FaMapMarkerAlt className="text-purple-500" />

                  Studio Address

                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-purple-100
                    bg-white/70
                    px-4
                    py-3.5
                    text-gray-700
                    outline-none
                    transition-all
                    duration-300
                    hover:border-purple-200
                    focus:border-purple-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-purple-100
                  "
                  placeholder="Enter studio address"
                />

              </div>

            </div>


            {/* SAVE */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() => navigate("/admin/resetpassword")}
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-6
                  py-3
                  font-semibold
                  text-red-600
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-red-100
                "
              >

                <FaLock />

                Reset Password

              </button>


              <button
                onClick={handleSubmit}
                disabled={loading}
                className="
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  gap-3
                  overflow-hidden
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  via-violet-600
                  to-fuchsia-600
                  px-7
                  py-3
                  font-bold
                  text-white
                  shadow-lg
                  shadow-purple-300/30
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative flex items-center gap-3">

                  <FaSave />

                  {loading ? "Saving..." : "Save Changes"}

                  {!loading && (
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  )}

                </span>

              </button>

            </div>

          </div>


          {/* =================================================
              ADMIN SECURITY CARD
          ================================================== */}

          <div className="space-y-5">

            <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 shadow-lg backdrop-blur-2xl">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                  <FaShieldAlt />

                </div>

                <div>

                  <h3 className="font-bold text-gray-800">
                    Account Security
                  </h3>

                  <p className="text-xs text-gray-500">
                    Keep your account protected
                  </p>

                </div>

              </div>


              <div className="space-y-3">

                <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">

                  <FaCheckCircle className="text-green-500" />

                  <div>

                    <p className="text-sm font-semibold text-gray-700">
                      Account Active
                    </p>

                    <p className="text-xs text-gray-500">
                      Your admin account is active
                    </p>

                  </div>

                </div>


                <button
                  onClick={() => navigate("/admin/resetpassword")}
                  className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white/70 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">

                    <FaLock />

                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-gray-700">
                      Password
                    </p>

                    <p className="text-xs text-gray-400">
                      Change your password
                    </p>

                  </div>

                  <FaArrowRight className="text-xs text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-purple-500" />

                </button>

              </div>

            </div>


            {/* ADMIN ROLE */}

            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-purple-300/20">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

              <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10" />

              <div className="relative">

                <FaUserShield className="text-3xl text-purple-100" />

                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-purple-200">
                  Administrator Role
                </p>

                <h3 className="mt-1 text-2xl font-extrabold">
                  {admin?.userType || "Super Admin"}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-purple-100">
                  Full access to studio management, albums, users and
                  account settings.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM BANNER
        ====================================================== */}

        <div className="mt-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-gray-900 via-purple-950 to-violet-950 p-6 text-white shadow-xl">

          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">

                <FaCamera className="text-xl text-purple-200" />

              </div>

              <div>

                <h3 className="text-lg font-bold">
                  Album Studio Administration
                </h3>

                <p className="mt-1 text-sm text-purple-200">
                  Manage your studio. Preserve every memory.
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 text-sm text-green-300">

              <FaCheckCircle />

              System Secure

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style>{`

        @keyframes adminFloat {

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


        @keyframes adminBlob {

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


        @keyframes adminRotate {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

      `}</style>

    </div>
  );
};

export default ProfilePage;
