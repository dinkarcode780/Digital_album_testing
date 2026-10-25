import React from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImages,
  FaArrowRight,
} from "react-icons/fa";

const invites = [
  {
    id: 1,
    title: "Rahul ❤️ Priya Wedding",
    studio: "Memories Studio",
    location: "Begusarai, Bihar",
    date: "25 June 2026",
    photos: 560,
    image: "https://picsum.photos/500/300?1",
    status: "Pending",
  },
  {
    id: 2,
    title: "Ankit & Neha Engagement",
    studio: "Royal Studio",
    location: "Patna, Bihar",
    date: "15 June 2026",
    photos: 320,
    image: "https://picsum.photos/500/300?2",
    status: "Accepted",
  },
  {
    id: 3,
    title: "Sangeet Ceremony",
    studio: "Wedding Clicks",
    location: "Muzaffarpur",
    date: "10 June 2026",
    photos: 280,
    image: "https://picsum.photos/500/300?3",
    status: "Pending",
  },
];

const Invites = () => {
  return (
    <div className="max-w-7xl mx-auto px-5 py-8">

      {/* Heading */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold">Album Invites</h1>

          <p className="text-gray-500 mt-2">
            Albums shared with you by studios.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search Invite..."
          className="border rounded-lg px-4 py-2 w-full md:w-80 outline-none"
        />

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">

        {invites.map((invite) => (

          <div
            key={invite.id}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl duration-300"
          >

            <img
              src={invite.image}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">

              <div className="flex justify-between">

                <h2 className="font-bold text-lg">
                  {invite.title}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    invite.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {invite.status}
                </span>

              </div>

              <p className="text-gray-500 mt-2">
                {invite.studio}
              </p>

              <div className="flex items-center gap-2 mt-4 text-gray-600">

                <FaCalendarAlt />

                {invite.date}

              </div>

              <div className="flex items-center gap-2 mt-2 text-gray-600">

                <FaMapMarkerAlt />

                {invite.location}

              </div>

              <div className="flex items-center gap-2 mt-2 text-gray-600">

                <FaImages />

                {invite.photos} Photos

              </div>

              <button
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex justify-center items-center gap-2"
              >

                Open Album

                <FaArrowRight />

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Invites;