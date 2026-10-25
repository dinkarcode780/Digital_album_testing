import React from "react";
import { FaTrashAlt, FaTimes } from "react-icons/fa";

const DeleteUserDialog = ({
  open,
  onClose,
  onDelete,
  user,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b">

          <h2 className="text-xl font-bold text-red-600">
            Delete User
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 text-center">

          <div className="w-20 h-20 bg-red-100 rounded-full flex justify-center items-center mx-auto">

            <FaTrashAlt className="text-4xl text-red-600" />

          </div>

          <h3 className="text-xl font-semibold mt-5">
            Delete "{user?.name}" ?
          </h3>

          <p className="text-gray-500 mt-3">
            This action cannot be undone.
            <br />
            All albums, media and user data may be permanently removed.
          </p>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-5 border-t">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(user)}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteUserDialog;