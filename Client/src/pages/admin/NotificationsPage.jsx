import React from "react";
import {
  FaBell,
  FaCalendarCheck,
  FaUserPlus,
  FaImages,
  FaMoneyBillWave,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

const notifications = [
  {
    id: 1,
    icon: <FaCalendarCheck className="text-blue-600" />,
    title: "New Booking Received",
    message: "Rahul Kumar booked Wedding Photography.",
    time: "2 min ago",
    status: "Unread",
  },
  {
    id: 2,
    icon: <FaUserPlus className="text-green-600" />,
    title: "New User Registered",
    message: "Priya Sharma created a new account.",
    time: "10 min ago",
    status: "Unread",
  },
  {
    id: 3,
    icon: <FaImages className="text-purple-600" />,
    title: "Album Uploaded",
    message: "Wedding album uploaded successfully.",
    time: "30 min ago",
    status: "Read",
  },
  {
    id: 4,
    icon: <FaMoneyBillWave className="text-yellow-600" />,
    title: "Payment Received",
    message: "₹30,000 advance payment received.",
    time: "1 hour ago",
    status: "Read",
  },
  {
    id: 5,
    icon: <FaCalendarCheck className="text-red-600" />,
    title: "Booking Cancelled",
    message: "Reception booking has been cancelled.",
    time: "3 hours ago",
    status: "Unread",
  },
];

const NotificationsPage = () => {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-5">

        <div>

          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Stay updated with recent activities.
          </p>

        </div>

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl">

          Mark All as Read

        </button>

      </div>

      {/* Notification List */}

      <div className="bg-white rounded-2xl shadow">

        {notifications.map((item) => (

          <div
            key={item.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 p-6 border-b last:border-none hover:bg-gray-50 transition"
          >

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-full bg-gray-100 flex justify-center items-center text-2xl">

                {item.icon}

              </div>

              <div>

                <h2 className="text-lg font-semibold">
                  {item.title}
                </h2>

                <p className="text-gray-500 mt-1">
                  {item.message}
                </p>

                <span className="text-sm text-gray-400">
                  {item.time}
                </span>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  item.status === "Unread"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {item.status}
              </span>

              <button className="w-10 h-10 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition">

                <FaCheckCircle />

              </button>

              <button className="w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition">

                <FaTrash />

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Summary Cards */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow p-6 text-center">

          <FaBell className="text-4xl text-purple-600 mx-auto" />

          <h2 className="text-3xl font-bold mt-4">
            25
          </h2>

          <p className="text-gray-500">
            Total Notifications
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">

          <FaCalendarCheck className="text-4xl text-blue-600 mx-auto" />

          <h2 className="text-3xl font-bold mt-4">
            8
          </h2>

          <p className="text-gray-500">
            Booking Alerts
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">

          <FaUserPlus className="text-4xl text-green-600 mx-auto" />

          <h2 className="text-3xl font-bold mt-4">
            6
          </h2>

          <p className="text-gray-500">
            New Users
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">

          <FaMoneyBillWave className="text-4xl text-yellow-600 mx-auto" />

          <h2 className="text-3xl font-bold mt-4">
            11
          </h2>

          <p className="text-gray-500">
            Payment Updates
          </p>

        </div>

      </div>

    </div>
  );
};

export default NotificationsPage;