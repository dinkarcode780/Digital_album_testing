import React from "react";
import {
  FaSave,
  FaGlobe,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const AdminSettings = () => {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Website Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your studio information and website settings.
        </p>

      </div>

      {/* Studio Information */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Studio Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="font-semibold">
              Studio Name
            </label>

            <input
              type="text"
              defaultValue="Album Studio"
              className="w-full border rounded-xl p-3 mt-2 outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

          <div>

            <label className="font-semibold">
              Website Name
            </label>

            <input
              type="text"
              defaultValue="Album Studio"
              className="w-full border rounded-xl p-3 mt-2 outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

          <div>

            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              defaultValue="albumstudio@gmail.com"
              className="w-full border rounded-xl p-3 mt-2 outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

          <div>

            <label className="font-semibold">
              Phone
            </label>

            <input
              type="text"
              defaultValue="+91 9876543210"
              className="w-full border rounded-xl p-3 mt-2 outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

          <div className="md:col-span-2">

            <label className="font-semibold">
              Address
            </label>

            <textarea
              rows="3"
              defaultValue="Begusarai, Bihar"
              className="w-full border rounded-xl p-3 mt-2 outline-none resize-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

        </div>

      </div>

      {/* Logo & Banner */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Logo & Banner
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="font-semibold">
              Upload Logo
            </label>

            <input
              type="file"
              className="w-full mt-3"
            />

          </div>

          <div>

            <label className="font-semibold">
              Upload Banner
            </label>

            <input
              type="file"
              className="w-full mt-3"
            />

          </div>

        </div>

      </div>

      {/* Social Links */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Social Links
        </h2>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Facebook URL"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Instagram URL"
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="YouTube URL"
            className="w-full border rounded-xl p-3"
          />

        </div>

      </div>

      {/* Contact Information */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Contact Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="font-semibold">
              Google Map Link
            </label>

            <input
              type="text"
              placeholder="https://..."
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

          <div>

            <label className="font-semibold">
              Website URL
            </label>

            <input
              type="text"
              placeholder="https://..."
              className="w-full border rounded-xl p-3 mt-2"
            />

          </div>

        </div>

      </div>

      {/* Save */}

      <div className="flex justify-end">

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-3">

          <FaSave />

          Save Settings

        </button>

      </div>

    </div>
  );
};

export default AdminSettings;