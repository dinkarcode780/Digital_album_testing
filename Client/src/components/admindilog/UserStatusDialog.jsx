import React from "react";
import { FaTimes, FaUserCheck, FaUserSlash } from "react-icons/fa";

const UserStatusDialog = ({ open, onClose, user, onConfirm }) => {
  if (!open) return null;

  // const isActive = user?.status === "Active";
  const isActive = user?.isActive;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">
          <h2 className="text-2xl font-bold">
            {isActive ? "Deactivate User" : "Activate User"}
          </h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="p-8 text-center">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
              isActive ? "bg-orange-100" : "bg-green-100"
            }`}
          >
            {isActive ? (
              <FaUserSlash className="text-4xl text-orange-600" />
            ) : (
              <FaUserCheck className="text-4xl text-green-600" />
            )}
          </div>

          <h3 className="text-xl font-semibold mt-6">
            {isActive ? "Deactivate this user?" : "Activate this user?"}
          </h3>

          <p className="text-gray-500 mt-3 leading-7">
            <span className="font-semibold">{user?.name}</span>

            {isActive
              ? " will no longer be able to login or access the system."
              : " will be able to login and access the system again."}
          </p>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(user)}
            className={`px-5 py-2 rounded-lg text-white ${
              isActive
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusDialog;
