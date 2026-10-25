import React from "react";
import {
  FaCamera,
  FaUsers,
  FaAward,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";

const stats = [
  {
    id: 1,
    title: "Happy Clients",
    value: "500+",
    icon: <FaUsers />,
  },
  {
    id: 2,
    title: "Events Covered",
    value: "1200+",
    icon: <FaCamera />,
  },
  {
    id: 3,
    title: "Years Experience",
    value: "10+",
    icon: <FaAward />,
  },
  {
    id: 4,
    title: "Client Satisfaction",
    value: "99%",
    icon: <FaHeart />,
  },
];

const features = [
  "Professional Photography",
  "4K Cinematic Videography",
  "Fast Online Album Delivery",
  "Unlimited Photo Selection",
  "Cloud Storage",
  "Premium Album Printing",
];

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-5 py-10">

      {/* Hero */}

      <div className="grid lg:grid-cols-2 gap-10 items-center">

        <div>

          <h1 className="text-4xl font-bold">
            About Album Studio
          </h1>

          <p className="text-gray-600 mt-6 leading-8">
            Album Studio is a modern digital platform where photography
            studios upload wedding photos and videos securely. Clients
            can easily view, select their favourite memories, download
            approved files and communicate with the studio from one place.
          </p>

          <button className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 rounded-lg">
            Contact Us
          </button>

        </div>

        <img
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900"
          alt="About"
          className="rounded-2xl shadow-lg"
        />

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

        {stats.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-6 text-center"
          >

            <div className="text-purple-600 text-4xl flex justify-center">

              {item.icon}

            </div>

            <h2 className="text-3xl font-bold mt-4">
              {item.value}
            </h2>

            <p className="text-gray-500 mt-2">
              {item.title}
            </p>

          </div>

        ))}

      </div>

      {/* Mission */}

      <div className="mt-20 grid lg:grid-cols-2 gap-10">

        <img
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900"
          alt="Mission"
          className="rounded-2xl shadow-lg"
        />

        <div>

          <h2 className="text-3xl font-bold">
            Our Mission
          </h2>

          <p className="text-gray-600 mt-6 leading-8">
            Our mission is to simplify the process of sharing and
            selecting wedding memories. We help photography studios
            deliver albums online with speed, security and an amazing
            customer experience.
          </p>

          <div className="mt-8 space-y-4">

            {features.map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-3"
              >

                <FaCheckCircle className="text-green-500" />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Team */}

      <div className="mt-20 text-center">

        <h2 className="text-3xl font-bold">
          Meet Our Team
        </h2>

        <p className="text-gray-500 mt-3">
          Passionate people behind every beautiful memory.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">

          {[1, 2, 3, 4].map((item) => (

            <div
              key={item}
              className="bg-white rounded-xl shadow p-6"
            >

              <img
                src={`https://i.pravatar.cc/200?img=${item + 10}`}
                alt=""
                className="w-28 h-28 rounded-full mx-auto"
              />

              <h3 className="font-bold mt-5">
                Team Member
              </h3>

              <p className="text-gray-500">
                Photographer
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default About;