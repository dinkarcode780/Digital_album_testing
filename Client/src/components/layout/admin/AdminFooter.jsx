import React from "react";
import { FaHeart } from "react-icons/fa";

const AdminFooter = () => {
  return (
    <footer className="bg-white border-t shadow-sm">

      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">

        {/* Left */}

        <p className="text-sm text-gray-500 text-center md:text-left">
          © {new Date().getFullYear()} Album Studio Admin. All Rights Reserved.
        </p>

        {/* Center */}

        <p className="text-sm text-gray-500 flex items-center gap-2">

          Made with

          <FaHeart className="text-red-500" />

          by Album Studio

        </p>

        {/* Right */}

        <p className="text-sm text-gray-500">
          Version 1.0.0
        </p>

      </div>

    </footer>
  );
};

export default AdminFooter;