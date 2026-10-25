
import React, { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

const EditUserDialog = ({ open, onClose, user, onSave }) => {
  const initialState = {
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "User",
  };

  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        role: user.userType || "User",
        profileImage: null,
      });
    } else {
      setFormData(initialState);
    }
  }, [user]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   onSave({
  //     ...user,
  //     ...formData,
  //     userType: formData.role,
  //   });
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    await onSave({
      ...user,
      ...formData,
      userType: formData.role,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

      <div
        className="
          bg-white
          w-full
          max-w-2xl
          rounded-2xl
          shadow-2xl
          flex
          flex-col
          max-h-[90vh]
          overflow-hidden
        "
      >

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b bg-white flex-shrink-0">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Edit User
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update user information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
          >
            <FaTimes size={20} />
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >

<div className="flex flex-col items-center">
  <img
    src={
      preview ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    }
    alt="profile"
    className="w-28 h-28 rounded-full object-cover border-4 border-purple-200"
  />

  <label className="mt-4 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg">
    Change Photo

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files[0];

        if (file) {
          setFormData({
            ...formData,
            profileImage: file,
          });

          setPreview(URL.createObjectURL(file));
        }
      }}
    />
  </label>
</div>  
          {/* Name */}

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className="
                w-full
                border
                rounded-xl
                p-3
                outline-none
                transition
                focus:ring-2
                focus:ring-purple-500
              "
            />
          </div>

          {/* Email */}

          <div>
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="
                w-full
                border
                rounded-xl
                p-3
                outline-none
                transition
                focus:ring-2
                focus:ring-purple-500
              "
            />
          </div>

          {/* Phone */}

          <div>
            <label className="block font-semibold mb-2">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="
                w-full
                border
                rounded-xl
                p-3
                outline-none
                transition
                focus:ring-2
                focus:ring-purple-500
              "
            />
          </div>

          {/* Continue in Part 2 */}

                    {/* Address */}

          <div>
            <label className="block font-semibold mb-2">
              Address
            </label>

            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address"
              className="
                w-full
                border
                rounded-xl
                p-3
                resize-none
                outline-none
                transition
                focus:ring-2
                focus:ring-purple-500
              "
            />
          </div>

          {/* Role */}

          <div>
            <label className="block font-semibold mb-2">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-xl
                p-3
                outline-none
                transition
                focus:ring-2
                focus:ring-purple-500
              "
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

       

        {/* Footer */}

        <div
          className="
            border-t
            bg-white
            px-6
            py-4
            flex
            flex-col-reverse
            sm:flex-row
            justify-end
            gap-3
            flex-shrink-0
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              sm:w-auto
              px-6
              py-3
              rounded-xl
              border
              font-medium
              hover:bg-gray-100
              transition
            "
          >
            Cancel
          </button>

        <button
  type="submit"
  disabled={loading}
  className={`
    w-full
    sm:w-auto
    px-6
    py-3
    rounded-xl
    text-white
    font-medium
    flex
    items-center
    justify-center
    gap-2
    transition
    ${
      loading
        ? "bg-purple-400 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700"
    }
  `}
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      Saving...
    </>
  ) : (
    <>
      <FaSave />
      Save Changes
    </>
  )}
</button>
        </div>
 </form>
      </div>
      
    </div>
  );
};

export default EditUserDialog;
