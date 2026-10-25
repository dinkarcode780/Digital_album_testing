import React from "react";
import {
  FaArrowLeft,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaCamera,
  FaWhatsapp,
  FaFileInvoice,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const BookingDetailsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-5 py-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <Link
            to="/admin/bookings"
            className="flex items-center gap-2 text-purple-600 font-semibold"
          >
            <FaArrowLeft />
            Back
          </Link>

          <h1 className="text-4xl font-bold mt-4">
            Booking Details
          </h1>

          <p className="text-gray-500 mt-2">
            Booking ID :
            <span className="font-semibold text-black ml-2">
              BK-10025
            </span>
          </p>

        </div>

        <span className="px-5 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
          Pending
        </span>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left */}

        <div className="lg:col-span-2 space-y-8">

          {/* Customer */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
              Customer Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="flex gap-3">

                <FaUser className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Name
                  </p>

                  <h3 className="font-semibold">
                    Dinkar Paswan
                  </h3>

                </div>

              </div>

              <div className="flex gap-3">

                <FaPhoneAlt className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Phone
                  </p>

                  <h3 className="font-semibold">
                    +91 9876543210
                  </h3>

                </div>

              </div>

              <div className="flex gap-3">

                <FaEnvelope className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Email
                  </p>

                  <h3 className="font-semibold">
                    dinkar@gmail.com
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* Event */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold mb-6">
              Event Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="flex gap-3">

                <FaCamera className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Event
                  </p>

                  <h3 className="font-semibold">
                    Wedding
                  </h3>

                </div>

              </div>

              <div className="flex gap-3">

                <FaCalendarAlt className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Start Date
                  </p>

                  <h3 className="font-semibold">
                    25 Dec 2026
                  </h3>

                </div>

              </div>

              <div className="flex gap-3">

                <FaCalendarAlt className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    End Date
                  </p>

                  <h3 className="font-semibold">
                    27 Dec 2026
                  </h3>

                </div>

              </div>

              <div className="flex gap-3">

                <FaMapMarkerAlt className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Location
                  </p>

                  <h3 className="font-semibold">
                    Begusarai, Bihar
                  </h3>

                </div>

              </div>

              <div className="flex gap-3">

                <FaUsers className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Guests
                  </p>

                  <h3 className="font-semibold">
                    500
                  </h3>

                </div>

              </div>

              <div className="flex gap-3">

                <FaRupeeSign className="text-purple-600 mt-1" />

                <div>

                  <p className="text-gray-500">
                    Budget
                  </p>

                  <h3 className="font-semibold">
                    ₹1,50,000
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* Requirements */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold mb-4">
              Special Requirements
            </h2>

            <p className="text-gray-600 leading-8">
              Need Drone Coverage, Cinematic Video, LED Wall and Live Streaming.
              Album should be delivered within 15 days.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

          {/* Payment */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Payment
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span>Total</span>

                <strong>₹1,50,000</strong>

              </div>

              <div className="flex justify-between">

                <span>Advance</span>

                <strong className="text-green-600">
                  ₹30,000
                </strong>

              </div>

              <div className="flex justify-between">

                <span>Remaining</span>

                <strong className="text-red-500">
                  ₹1,20,000
                </strong>

              </div>

            </div>

          </div>

          {/* Booking Status */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Booking Status
            </h2>

            <select className="w-full border rounded-xl p-3">

              <option>Pending</option>

              <option>Confirmed</option>

              <option>Completed</option>

              <option>Cancelled</option>

            </select>

          </div>

          {/* Assign Photographer */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Assign Photographer
            </h2>

            <select className="w-full border rounded-xl p-3">

              <option>Select Photographer</option>

              <option>Rahul Kumar</option>

              <option>Abhishek Singh</option>

              <option>Vikas Raj</option>

            </select>

          </div>

          {/* Actions */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              Quick Actions
            </h2>

            <div className="space-y-3">

              <button className="w-full bg-green-600 text-white py-3 rounded-xl flex justify-center items-center gap-2">

                <FaCheckCircle />

                Approve Booking

              </button>

              <button className="w-full bg-yellow-500 text-white py-3 rounded-xl flex justify-center items-center gap-2">

                <FaClock />

                Mark Pending

              </button>

              <button className="w-full bg-purple-600 text-white py-3 rounded-xl flex justify-center items-center gap-2">

                <FaWhatsapp />

                Contact Customer

              </button>

              <button className="w-full bg-gray-800 text-white py-3 rounded-xl flex justify-center items-center gap-2">

                <FaFileInvoice />

                Download Invoice

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingDetailsPage;