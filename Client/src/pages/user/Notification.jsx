import React from "react";
import {
  FaBell,
  FaImages,
  FaCheckCircle,
  FaDownload,
  FaUserCheck,
} from "react-icons/fa";

const notifications = [
  {
    id: 1,
    title: "New Album Available",
    message:
      "Rahul ❤️ Priya Wedding album has been shared with you.",
    time: "2 min ago",
    icon: <FaImages className="text-purple-600" />,
    unread: true,
  },
  {
    id: 2,
    title: "Selection Approved",
    message:
      "Your selected photos have been approved by the studio.",
    time: "1 hour ago",
    icon: <FaCheckCircle className="text-green-600" />,
    unread: true,
  },
  {
    id: 3,
    title: "Download Enabled",
    message:
      "You can now download your selected album.",
    time: "Yesterday",
    icon: <FaDownload className="text-blue-600" />,
    unread: false,
  },
  {
    id: 4,
    title: "Selection Submitted",
    message:
      "Your photo selection has been submitted successfully.",
    time: "2 days ago",
    icon: <FaUserCheck className="text-orange-500" />,
    unread: false,
  },
];

const Notification = () => {
  return (
    <div className="max-w-5xl mx-auto px-5 py-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaBell />
            Notifications
          </h1>

          <p className="text-gray-500 mt-2">
            Stay updated with your latest activities.
          </p>
        </div>

        <button className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700">
          Mark All Read
        </button>

      </div>

      {/* Notifications */}

      <div className="space-y-5">

        {notifications.map((item) => (

          <div
            key={item.id}
            className={`flex items-start gap-4 rounded-xl p-5 shadow border transition hover:shadow-lg ${
              item.unread
                ? "bg-purple-50 border-purple-200"
                : "bg-white"
            }`}
          >

            <div className="bg-white p-3 rounded-full shadow">

              {item.icon}

            </div>

            <div className="flex-1">

              <div className="flex justify-between items-start">

                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <span className="text-sm text-gray-500">
                  {item.time}
                </span>

              </div>

              <p className="text-gray-600 mt-2">
                {item.message}
              </p>

            </div>

            {item.unread && (
              <span className="w-3 h-3 rounded-full bg-purple-600 mt-2"></span>
            )}

          </div>

        ))}

      </div>

    </div>
  );
};

export default Notification;