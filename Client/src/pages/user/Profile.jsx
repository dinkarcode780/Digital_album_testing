import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  userLogout,
  userUpdateProfile,
  getUserById,
  userChangePassword,
} from "../../app/auth/authThunk";

import {
  FaUserEdit,
  FaLock,
  FaImages,
  FaDownload,
  FaHeart,
  FaSignOutAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCamera,
  FaCalendarAlt,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaUpload,
  FaSync,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);

  const userId = user?._id || user?.id;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch updated user details on mount
  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const handleOpenEditModal = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      profileImage: null,
    });
    setImagePreview(user?.profileImage || "");
    setIsEditModalOpen(true);
  };

  const handleOpenPasswordModal = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User ID not found!");
      return;
    }

    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(
        userUpdateProfile({
          userId,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          profileImage: formData.profileImage,
        })
      );

      if (userUpdateProfile.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Profile updated successfully!");
        setIsEditModalOpen(false);
        // Refresh user profile
        dispatch(getUserById(userId));
      } else {
        toast.error(resultAction.payload?.message || "Failed to update profile!");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const resultAction = await dispatch(
        userChangePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })
      );

      if (userChangePassword.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message || "Password changed successfully!"
        );
        setIsPasswordModalOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(
          resultAction.payload?.message || "Failed to change password!"
        );
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const actionItems = [
    {
      title: "Change Password",
      subtitle: "Keep your account secure",
      icon: FaLock,
      color: "purple",
      action: handleOpenPasswordModal,
    },
    {
      title: "My Albums",
      subtitle: "View your memories",
      icon: FaImages,
      color: "violet",
      action: () => navigate("/albums"),
    },
    {
      title: "Downloads",
      subtitle: "Your downloaded files",
      icon: FaDownload,
      color: "blue",
      action: () => navigate("/downloads"),
    },
    {
      title: "Favorites",
      subtitle: "Your favorite moments",
      icon: FaHeart,
      color: "pink",
      action: () => navigate("/favorites"),
    },
  ];

  // Helper date formatter
  const formattedMemberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "2026";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#faf8ff] via-[#f5f0ff] to-[#eee7ff] px-4 py-8 md:px-8">
      {/* =====================================================
          ANIMATED BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-purple-300/20 blur-[110px] animate-pulse" />

      <div
        className="pointer-events-none absolute -right-40 top-[25%] h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[120px]"
        style={{
          animation: "profileFloat 9s ease-in-out infinite",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-[-150px] left-[35%] h-[450px] w-[450px] rounded-full bg-fuchsia-300/15 blur-[110px]"
        style={{
          animation: "profileFloat 11s ease-in-out infinite reverse",
        }}
      />

      {/* Floating dots */}
      <div
        className="absolute left-[10%] top-[25%] h-3 w-3 rounded-full bg-purple-500/30"
        style={{
          animation: "smallFloat 5s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[15%] top-[18%] h-4 w-4 rounded-full bg-violet-500/30"
        style={{
          animation: "smallFloat 7s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-[20%] right-[35%] h-3 w-3 rounded-full bg-fuchsia-400/30"
        style={{
          animation: "smallFloat 6s ease-in-out infinite",
        }}
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
              <FaHeart className="text-purple-600" />
              My Account
            </div>

            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-800 md:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Profile
              </span>
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your account details and keep your profile updated.
            </p>
          </div>

          <button
            onClick={() => userId && dispatch(getUserById(userId))}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-xl border border-purple-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm backdrop-blur-md transition-all hover:bg-purple-50 hover:shadow-md disabled:opacity-50"
            title="Refresh profile data"
          >
            <FaSync className={`text-xs ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* =====================================================
            PROFILE HERO
        ====================================================== */}
        <div className="relative mb-8 overflow-hidden rounded-[32px] border border-white/80 bg-white/55 shadow-[0_20px_70px_rgba(124,58,237,0.12)] backdrop-blur-2xl">
          {/* Background decorative circles */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
          <div className="absolute -bottom-32 left-[35%] h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-7 p-7 md:flex-row md:p-10">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              {/* Outer animated ring */}
              <div
                className="absolute -inset-2 rounded-full border-2 border-purple-300/40"
                style={{
                  animation: "profileRotate 8s linear infinite",
                }}
              />

              {/* Gradient ring */}
              <div className="rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 p-1.5 shadow-xl shadow-purple-300/30">
                <img
                  src={
                    user?.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&background=7c3aed&color=fff&size=200`
                  }
                  alt={user?.name || "User"}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover md:h-36 md:w-36"
                />
              </div>

              {/* Status Indicator */}
              <div
                className={`absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white text-white shadow-md ${
                  user?.isActive !== false ? "bg-green-500" : "bg-gray-400"
                }`}
                title={user?.isActive !== false ? "Active Account" : "Inactive"}
              >
                <FaCheckCircle className="text-xs" />
              </div>
            </div>

            {/* User info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col items-center gap-2 md:flex-row">
                <h2 className="text-3xl font-extrabold text-gray-800">
                  {user?.name || "User Name"}
                </h2>

                <span className="rounded-full bg-purple-100 px-3.5 py-1 text-xs font-bold text-purple-700 capitalize">
                  {user?.userType || "Client"}
                </span>
              </div>

              <p className="mt-2 text-gray-500">
                Welcome to your personal digital album profile portal.
              </p>

              {/* Contact Information */}
              <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm text-gray-600 backdrop-blur-md">
                  <FaPhoneAlt className="text-purple-500" />
                  {user?.phoneNumber || "Not provided"}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm text-gray-600 backdrop-blur-md">
                  <FaEnvelope className="text-purple-500" />
                  {user?.email || "Not provided"}
                </div>

                {user?.address && (
                  <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm text-gray-600 backdrop-blur-md">
                    <FaMapMarkerAlt className="text-purple-500" />
                    {user.address}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleOpenEditModal}
              className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-purple-300/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
            >
              <FaUserEdit />
              Edit Profile
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* =====================================================
            STATS CARDS
        ====================================================== */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="group rounded-2xl border border-white/80 bg-white/55 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-110">
                <FaImages />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">
                  {user?.albumCount || "Digital"}
                </p>
                <p className="text-xs text-gray-500">Albums</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-white/80 bg-white/55 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-500 transition-transform group-hover:scale-110">
                <FaHeart />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">
                  {user?.favoriteCount || "Saved"}
                </p>
                <p className="text-xs text-gray-500">Favorites</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-white/80 bg-white/55 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-500 transition-transform group-hover:scale-110">
                <FaDownload />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">
                  {user?.downloadCount || "Media"}
                </p>
                <p className="text-xs text-gray-500">Downloads</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-white/80 bg-white/55 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-transform group-hover:scale-110">
                <FaShieldAlt />
              </div>
              <div>
                <p className="text-sm font-bold text-green-600">
                  {user?.isActive !== false ? "Active" : "Inactive"}
                </p>
                <p className="text-xs text-gray-500">Account Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            CONTENT GRID
        ====================================================== */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          {/* =================================================
              PERSONAL INFORMATION CARD
          ================================================== */}
          <div className="rounded-[30px] border border-white/80 bg-white/55 p-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-2xl md:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your profile details fetched live from your account
                </p>
              </div>

              <button
                onClick={handleOpenEditModal}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-all hover:bg-purple-200"
                title="Edit details"
              >
                <FaUserEdit />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div className="rounded-2xl border border-purple-100 bg-white/60 p-4 transition-all hover:border-purple-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <FaUserEdit className="text-purple-500" />
                  FULL NAME
                </div>
                <p className="mt-2 font-semibold text-gray-800">
                  {user?.name || "Not provided"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-purple-100 bg-white/60 p-4 transition-all hover:border-purple-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <FaEnvelope className="text-purple-500" />
                  EMAIL ADDRESS
                </div>
                <p className="mt-2 break-all font-semibold text-gray-800">
                  {user?.email || "Not provided"}
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-purple-100 bg-white/60 p-4 transition-all hover:border-purple-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <FaPhoneAlt className="text-purple-500" />
                  PHONE NUMBER
                </div>
                <p className="mt-2 font-semibold text-gray-800">
                  {user?.phoneNumber || "Not provided"}
                </p>
              </div>

              {/* Address */}
              <div className="rounded-2xl border border-purple-100 bg-white/60 p-4 transition-all hover:border-purple-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <FaMapMarkerAlt className="text-purple-500" />
                  ADDRESS
                </div>
                <p className="mt-2 font-semibold text-gray-800">
                  {user?.address || "Not specified"}
                </p>
              </div>

              {/* Account type */}
              <div className="rounded-2xl border border-purple-100 bg-white/60 p-4 transition-all hover:border-purple-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <FaCamera className="text-purple-500" />
                  ACCOUNT TYPE
                </div>
                <p className="mt-2 font-semibold capitalize text-purple-700">
                  {user?.userType || "Client"}
                </p>
              </div>

              {/* Member Since */}
              <div className="rounded-2xl border border-purple-100 bg-white/60 p-4 transition-all hover:border-purple-200 hover:shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <FaCalendarAlt className="text-purple-500" />
                  MEMBER SINCE
                </div>
                <p className="mt-2 font-semibold text-gray-800">
                  {formattedMemberSince}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================== */}
          <div>
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-800">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account easily
              </p>
            </div>

            <div className="space-y-4">
              {actionItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/80 bg-white/55 p-4 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${
                        item.color === "pink"
                          ? "bg-pink-100 text-pink-500"
                          : item.color === "blue"
                          ? "bg-blue-100 text-blue-500"
                          : item.color === "violet"
                          ? "bg-violet-100 text-violet-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <Icon />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.subtitle}
                      </p>
                    </div>

                    <FaArrowRight className="text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-purple-500" />
                  </button>
                );
              })}

              {/* LOGOUT */}
              <button
                onClick={async () => {
                  await dispatch(userLogout());
                  navigate("/");
                }}
                className="group flex w-full items-center gap-4 rounded-2xl border border-red-100 bg-red-50/60 p-4 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500 transition-transform duration-300 group-hover:scale-110">
                  <FaSignOutAlt />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-red-600">Logout</p>
                  <p className="mt-1 text-xs text-red-400">
                    Sign out of your account
                  </p>
                </div>

                <FaArrowRight className="text-red-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM SECURITY CARD
        ====================================================== */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-[0_20px_60px_rgba(124,58,237,0.2)]">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl">
                <FaShieldAlt className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  Your memories are protected
                </h3>
                <p className="mt-1 text-sm text-purple-100">
                  Your personal information and digital albums are securely encrypted.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-md">
              <FaCheckCircle />
              Secure Account
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          EDIT PROFILE MODAL (FULLY RESPONSIVE FOR MOBILE & DESKTOP)
      ====================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative my-auto w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <FaUserEdit className="text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Edit Profile
                  </h3>
                  <p className="text-xs text-gray-500">
                    Update your profile info and picture
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-800 shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitEdit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[calc(90vh-130px)]">
                {/* Profile Image Picker */}
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-purple-100 bg-purple-50/50 p-3 sm:p-4">
                  <div className="relative">
                    <img
                      src={
                        imagePreview ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          formData.name || "User"
                        )}&background=7c3aed&color=fff`
                      }
                      alt="Preview"
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white object-cover shadow-md"
                    />
                    <label
                      htmlFor="profileImageUpload"
                      className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-110"
                      title="Upload new picture"
                    >
                      <FaCamera className="text-xs" />
                    </label>
                    <input
                      id="profileImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 text-center">
                    Click camera icon to change photo
                  </span>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Address Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Sticky Footer / Action Buttons */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shrink-0 flex items-center justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CHANGE PASSWORD MODAL (FULLY RESPONSIVE)
      ====================================================== */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative my-auto w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <FaKey className="text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Change Password
                  </h3>
                  <p className="text-xs text-gray-500">
                    Update your account password securely
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-800 shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitChangePassword} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[calc(90vh-130px)]">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Current Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pr-10 text-sm font-medium text-gray-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pr-10 text-sm font-medium text-gray-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="Enter new password (min 6 chars)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Confirm New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pr-10 text-sm font-medium text-gray-800 outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="Re-enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shrink-0 flex items-center justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300 disabled:opacity-50"
                >
                  {isSubmittingPassword ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          ANIMATION CSS
      ====================================================== */}
      <style>{`
        @keyframes profileFloat {
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

        @keyframes smallFloat {
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

        @keyframes profileRotate {
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

export default Profile;