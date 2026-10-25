import React from "react";
import {
  FaCamera,
  FaVideo,
  FaHeart,
  FaRing,
  FaBaby,
  FaBirthdayCake,
} from "react-icons/fa";

const services = [
  {
    id: 1,
    title: "Wedding Photography",
    icon: <FaCamera size={35} />,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
    description:
      "Professional wedding photography with premium editing and high-quality albums.",
  },
  {
    id: 2,
    title: "Wedding Videography",
    icon: <FaVideo size={35} />,
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
    description:
      "Cinematic wedding films with drone shots, teaser and full HD videos.",
  },
  {
    id: 3,
    title: "Pre Wedding Shoot",
    icon: <FaHeart size={35} />,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
    description:
      "Beautiful outdoor and indoor pre-wedding photoshoots at amazing locations.",
  },
  {
    id: 4,
    title: "Engagement Shoot",
    icon: <FaRing size={35} />,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    description:
      "Capture your engagement ceremony with professional photography.",
  },
  {
    id: 5,
    title: "Baby Shoot",
    icon: <FaBaby size={35} />,
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800",
    description:
      "Creative newborn and baby photography with beautiful themes.",
  },
  {
    id: 6,
    title: "Birthday Photography",
    icon: <FaBirthdayCake size={35} />,
    image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800",
    description:
      "Capture birthday celebrations with candid moments and HD videos.",
  },
];

const Services = () => {
  return (
    <div className="max-w-7xl mx-auto px-5 py-10">

      {/* Heading */}

      <div className="text-center">

        <h1 className="text-4xl font-bold">
          Our Services
        </h1>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          We capture your beautiful memories with premium photography
          and cinematic videography.
        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

        {services.map((service) => (

          <div
            key={service.id}
            className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl duration-300"
          >

            <img
              src={service.image}
              alt={service.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">

              <div className="text-purple-600 mb-4">

                {service.icon}

              </div>

              <h2 className="text-2xl font-semibold">

                {service.title}

              </h2>

              <p className="text-gray-500 mt-3">

                {service.description}

              </p>

              <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg">

                View Details

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Services;