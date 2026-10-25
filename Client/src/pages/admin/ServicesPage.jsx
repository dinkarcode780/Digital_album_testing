import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaToggleOn,
} from "react-icons/fa";

const services = [
  {
    _id: 1,
    title: "Wedding Photography",
    category: "Wedding",
    price: "₹50,000",
    duration: "2 Days",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
  },
  {
    _id: 2,
    title: "Pre Wedding Shoot",
    category: "Wedding",
    price: "₹20,000",
    duration: "1 Day",
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600",
  },
  {
    _id: 3,
    title: "Birthday Photography",
    category: "Birthday",
    price: "₹12,000",
    duration: "6 Hours",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600",
  },
];

const ServicesPage = () => {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between gap-5">

        <div>

          <h1 className="text-3xl font-bold">
            Services
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all photography services.
          </p>

        </div>

        <Link
          to="/admin/services/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-3"
        >
          <FaPlus />

          Add Service
        </Link>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <FaSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search Service..."
          className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>

      {/* Cards */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-7">

        {services.map((service) => (

          <div
            key={service._id}
            className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl duration-300"
          >

            <img
              src={service.image}
              alt={service.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">

              <div className="flex justify-between">

                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">

                  {service.category}

                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    service.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {service.status}
                </span>

              </div>

              <h2 className="text-xl font-bold mt-5">

                {service.title}

              </h2>

              <div className="mt-4 space-y-2 text-gray-600">

                <p>

                  <strong>Price :</strong> {service.price}

                </p>

                <p>

                  <strong>Duration :</strong> {service.duration}

                </p>

              </div>

              <div className="grid grid-cols-4 gap-3 mt-6">

                <Link
                  to={`/admin/services/details/${service._id}`}
                  className="h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex justify-center items-center transition"
                >

                  <FaEye />

                </Link>

                <Link
                  to={`/admin/services/edit/${service._id}`}
                  className="h-10 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white flex justify-center items-center transition"
                >

                  <FaEdit />

                </Link>

                <button className="h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition">

                  <FaTrash className="mx-auto" />

                </button>

                <button className="h-10 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition">

                  <FaToggleOn className="mx-auto" />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ServicesPage;