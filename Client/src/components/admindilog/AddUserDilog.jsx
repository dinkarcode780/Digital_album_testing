// import React, { useState } from "react";
// import {
//   FaTimes,
//   FaSave,
//   FaUser,
//   FaEnvelope,
//   FaPhoneAlt,
//   FaLock,
//   FaMapMarkerAlt,
//   FaUserShield,
//   FaImage,
// } from "react-icons/fa";

// const AddUserDialog = ({
//   open,
//   onClose,
//   onSave,
// }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     address: "",
//     password: "",
//     userType: "User",
//     profileImage: null,
//   });

//   if (!open) return null;

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "profileImage") {
//       setFormData({
//         ...formData,
//         profileImage: files[0],
//       });
//       return;
//     }

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     onSave(formData);

//     setFormData({
//       name: "",
//       email: "",
//       phoneNumber: "",
//       address: "",
//       password: "",
//       userType: "User",
//       profileImage: null,
//     });

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">

//       <div className="bg-white
//     w-full
//     max-w-2xl
//     rounded-2xl
//     shadow-2xl
//     flex
//     flex-col
//     max-h-[90vh]
//     overflow-hidden">

//         {/* Header */}

//         <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between flex-shrink-0 z-10">

//           <h2 className="text-2xl font-bold">
//             Add New User
//           </h2>

//           <button onClick={onClose}>
//             <FaTimes size={20} />
//           </button>

//         </div>

//         {/* Form */}

//         <form
//           onSubmit={handleSubmit}
//           className="flex-1 overflow-y-auto  p-5 sm:p-6 space-y-5"
//         >

//           <div className="grid grid-cols-1 md:grid-cols-2  gap-5">

//             {/* Name */}

//             <div>

//               <label className="font-medium">
//                 Full Name
//               </label>

//               <div className="relative mt-2">

//                 <FaUser className="absolute left-4 top-4 text-gray-400" />

//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter Name"
//                   className="w-full border rounded-lg py-3 pl-11 pr-3 outline-none focus:ring-2 focus:ring-purple-500"
//                 />

//               </div>

//             </div>

//             {/* Email */}

//             <div>

//               <label className="font-medium">
//                 Email (Optional)
//               </label>

//               <div className="relative mt-2">

//                 <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter Email"
//                   className="w-full border rounded-lg py-3 pl-11 pr-3 outline-none focus:ring-2 focus:ring-purple-500"
//                 />

//               </div>

//             </div>

//             {/* Mobile */}

//             <div>

//               <label className="font-medium">
//                 Mobile Number
//               </label>

//               <div className="relative mt-2">

//                 <FaPhoneAlt className="absolute left-4 top-4 text-gray-400" />

//                 <input
//                   type="text"
//                   maxLength={10}
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   placeholder="Enter Mobile Number"
//                   className="w-full border rounded-lg py-3 pl-11 pr-3 outline-none focus:ring-2 focus:ring-purple-500"
//                 />

//               </div>

//             </div>

//             {/* Password */}

//             <div>

//               <label className="font-medium">
//                 Password
//               </label>

//               <div className="relative mt-2">

//                 <FaLock className="absolute left-4 top-4 text-gray-400" />

//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter Password"
//                   className="w-full border rounded-lg py-3 pl-11 pr-3 outline-none focus:ring-2 focus:ring-purple-500"
//                 />

//               </div>

//             </div>

//           </div>

//           {/* Address */}

//           <div>

//             <label className="font-medium">
//               Address
//             </label>

//             <div className="relative mt-2">

//               <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />

//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Enter Address"
//                 className="w-full border rounded-lg py-3 pl-11 pr-3 outline-none focus:ring-2 focus:ring-purple-500"
//               />

//             </div>

//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//             {/* User Type */}

//             <div>

//               <label className="font-medium">
//                 User Type
//               </label>

//               <div className="relative mt-2">

//                 <FaUserShield className="absolute left-4 top-4 text-gray-400" />

//                 <select
//                   name="userType"
//                   value={formData.userType}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg py-3 pl-11 pr-3 outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="User">
//                     User
//                   </option>

//                   <option value="Admin">
//                     Admin
//                   </option>

//                 </select>

//               </div>

//             </div>

//             {/* Profile */}

//             <div>

//               <label className="font-medium">
//                 Profile Image
//               </label>

//               <div className="relative mt-2">

//                 <FaImage className="absolute left-4 top-4 text-gray-400" />

//                 <input
//                   type="file"
//                   name="profileImage"
//                   accept="image/*"
//                   onChange={handleChange}
//                   className="w-full border rounded-lg py-2.5 pl-11 pr-3"
//                 />

//               </div>

//             </div>

//           </div>

//           {/* Footer */}

//           <div className="flex justify-end gap-3 border-t pt-5">

//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-3 rounded-lg border hover:bg-gray-100"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
//             >
//               <FaSave />

//               Add User
//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default AddUserDialog;

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaMapMarkerAlt,
  FaUserShield,
  FaImage,
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";

const initialForm = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  password: "",
  userType: "User",
  profileImage: null,
};

const AddUserDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState(null);

  // ==========================================
  // BODY SCROLL LOCK
  // ==========================================

  useEffect(() => {
    if (!open) return;

    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [open]);

  // ==========================================
  // IMAGE PREVIEW
  // ==========================================

  useEffect(() => {
    if (!formData.profileImage) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.profileImage);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [formData.profileImage]);

  // ==========================================
  // CLOSE / RESET
  // ==========================================

  const handleClose = () => {
    setFormData(initialForm);
    setPreview(null);
    onClose();
  };

  // ==========================================
  // INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      setFormData((prev) => ({
        ...prev,
        profileImage: files?.[0] || null,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(formData);

    setFormData(initialForm);
    setPreview(null);

    onClose();
  };

  if (!open) return null;

  // ==========================================
  // MODAL
  // ==========================================

  const modal = (
    <div
      className="
        fixed
        inset-0
        z-[999999]
        flex
        items-center
        justify-center
        bg-black/60
        p-3
        backdrop-blur-md
        sm:p-5
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >

      {/* ======================================
          BACKGROUND GLOW
      ======================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-purple-500/20
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-fuchsia-500/20
          blur-3xl
        "
      />

      {/* ======================================
          MODAL CONTAINER
      ======================================= */}

      <div
        className="
          relative
          flex
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-white
          bg-white
          shadow-[0_30px_100px_rgba(0,0,0,0.35)]
          animate-modalIn
        "
        style={{
          height: "min(720px, calc(100vh - 30px))",
        }}
      >

        {/* ====================================
            HEADER
        ===================================== */}

        <div
          className="
            relative
            flex
            min-h-[82px]
            flex-shrink-0
            items-center
            justify-between
            overflow-hidden
            border-b
            border-purple-100
            bg-gradient-to-r
            from-purple-50
            via-white
            to-violet-50
            px-5
            py-4
            sm:px-7
          "
        >

          {/* Header decoration */}

          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-16
              h-40
              w-40
              rounded-full
              bg-purple-300/30
              blur-3xl
            "
          />

          {/* Left */}

          <div className="relative flex items-center gap-4">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-purple-600
                to-fuchsia-600
                text-white
                shadow-lg
                shadow-purple-300/40
              "
            >
              <FaUserPlus className="text-xl" />
            </div>

            <div>

              <h2 className="text-xl font-extrabold text-gray-800 sm:text-2xl">
                Add New User
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Create a new account for your digital album
              </p>

            </div>

          </div>

          {/* Close */}

          <button
            type="button"
            onClick={handleClose}
            className="
              relative
              flex
              h-10
              w-10
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gray-100
              text-gray-500
              transition-all
              duration-300
              hover:rotate-90
              hover:bg-red-100
              hover:text-red-600
            "
          >
            <FaTimes />
          </button>

        </div>


        {/* ====================================
            FORM
        ===================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >

          {/* ==================================
              SCROLL CONTENT
          =================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-5
              py-6
              sm:px-7
            "
          >

            {/* =================================
                PROFILE PREVIEW
            ================================== */}

            <div className="mb-7 flex flex-col items-center">

              <div className="relative">

                <div
                  className="
                    absolute
                    -inset-2
                    rounded-full
                    bg-gradient-to-r
                    from-purple-400
                    to-fuchsia-400
                    opacity-25
                    blur-md
                  "
                />

                <div
                  className="
                    relative
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border-4
                    border-white
                    bg-gradient-to-br
                    from-purple-100
                    to-violet-100
                    shadow-xl
                  "
                >

                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-3xl text-purple-300" />
                  )}

                </div>

                {preview && (
                  <div
                    className="
                      absolute
                      bottom-0
                      right-0
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      border-white
                      bg-green-500
                      text-white
                    "
                  >
                    <FaCheckCircle className="text-xs" />
                  </div>
                )}

              </div>

              <p className="mt-3 text-xs font-medium text-gray-400">
                Profile preview
              </p>

            </div>


            {/* =================================
                PERSONAL DETAILS
            ================================== */}

            <div className="mb-8">

              <div className="mb-5 flex items-center gap-3">

                <div className="h-9 w-1 rounded-full bg-gradient-to-b from-purple-600 to-fuchsia-500" />

                <div>

                  <h3 className="font-bold text-gray-800">
                    Personal Details
                  </h3>

                  <p className="text-xs text-gray-400">
                    Basic information of the user
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* NAME */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                    <FaUser className="text-purple-500" />

                    Full Name

                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-gray-400
                      hover:border-purple-300
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                    <FaEnvelope className="text-purple-500" />

                    Email

                    <span className="text-xs font-normal text-gray-400">
                      (Optional)
                    </span>

                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-gray-400
                      hover:border-purple-300
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                </div>


                {/* PHONE */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                    <FaPhoneAlt className="text-purple-500" />

                    Mobile Number

                  </label>

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    required
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-gray-400
                      hover:border-purple-300
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                </div>


                {/* PASSWORD */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                    <FaLock className="text-purple-500" />

                    Password

                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-gray-400
                      hover:border-purple-300
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                </div>

              </div>

            </div>


            {/* =================================
                ACCOUNT DETAILS
            ================================== */}

            <div>

              <div className="mb-5 flex items-center gap-3">

                <div className="h-9 w-1 rounded-full bg-gradient-to-b from-violet-600 to-fuchsia-500" />

                <div>

                  <h3 className="font-bold text-gray-800">
                    Account Details
                  </h3>

                  <p className="text-xs text-gray-400">
                    Configure account and profile
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* ADDRESS */}

                <div className="md:col-span-2">

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                    <FaMapMarkerAlt className="text-purple-500" />

                    Address

                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-gray-400
                      hover:border-purple-300
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                </div>


                {/* USER TYPE */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                    <FaUserShield className="text-purple-500" />

                    User Type

                  </label>

                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      py-3.5
                      font-medium
                      outline-none
                      transition-all
                      duration-300
                      hover:border-purple-300
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  >
                    <option value="User">
                      User
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>

                </div>


                {/* PROFILE IMAGE */}

                <div>

                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                    <FaImage className="text-purple-500" />

                    Profile Image

                  </label>

                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="
                      mt-2
                      block
                      w-full
                      cursor-pointer
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-3
                      py-2.5
                      text-sm
                      text-gray-500
                      transition-all
                      file:mr-3
                      file:rounded-lg
                      file:border-0
                      file:bg-purple-100
                      file:px-3
                      file:py-2
                      file:font-semibold
                      file:text-purple-700
                      hover:border-purple-300
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                </div>

              </div>

            </div>

            {/* Bottom spacing */}

            <div className="h-5" />

          </div>


          {/* ====================================
              FOOTER
          ===================================== */}

          <div
            className="
              flex
              min-h-[76px]
              flex-shrink-0
              items-center
              justify-end
              gap-3
              border-t
              border-gray-100
              bg-white
              px-5
              py-4
              sm:px-7
            "
          >

            <button
              type="button"
              onClick={handleClose}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-3
                font-semibold
                text-gray-600
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-gray-50
                hover:shadow-sm
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              className="
                group
                relative
                flex
                items-center
                gap-2
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                via-violet-600
                to-fuchsia-600
                px-6
                py-3
                font-bold
                text-white
                shadow-lg
                shadow-purple-300/30
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              {/* Shine */}

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/30
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <span className="relative flex items-center gap-2">

                <FaSave />

                Add User

              </span>

            </button>

          </div>

        </form>

      </div>


      {/* ======================================
          ANIMATION
      ======================================= */}

      <style>{`

        @keyframes modalIn {

          from {
            opacity: 0;
            transform: translateY(25px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

        }

        .animate-modalIn {
          animation: modalIn 0.3s ease-out;
        }

        /* Premium scrollbar */

        .overflow-y-auto::-webkit-scrollbar {
          width: 7px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c4b5fd;
          border-radius: 20px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }

      `}</style>

    </div>
  );

  // ==========================================
  // IMPORTANT:
  // RENDER DIRECTLY INTO BODY
  // ==========================================

  return createPortal(modal, document.body);
};

export default AddUserDialog;