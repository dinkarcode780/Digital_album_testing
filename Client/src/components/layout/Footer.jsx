import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full max-w-full overflow-hidden bg-slate-900 text-gray-300 mt-20">

      {/* Top Border */}

      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>

      <div className="w-full max-w-7xl mx-auto min-w-0 px-4 sm:px-6 py-12 sm:py-16">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* About */}

          <div>

            <h2 className="text-3xl font-bold text-white">
              Album Studio
            </h2>

            <p className="mt-5 max-w-full break-words leading-8 text-gray-400">
              Relive your unforgettable memories with beautifully
              organized albums, cinematic videos and secure cloud
              storage for every special occasion.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-purple-600 duration-300 flex items-center justify-center"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-pink-600 duration-300 flex items-center justify-center"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-green-600 duration-300 flex items-center justify-center"
              >
                <FaWhatsapp />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-red-600 duration-300 flex items-center justify-center"
              >
                <FaYoutube />
              </a>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6 border-l-4 border-purple-500 pl-3">
              Quick Links
            </h3>

            <div className="space-y-4">

              <Link className="block hover:text-purple-400 duration-300" to="/">
                Home
              </Link>

              <Link className="block hover:text-purple-400 duration-300" to="/albums">
                Albums
              </Link>

              <Link className="block hover:text-purple-400 duration-300" to="/services">
                Services
              </Link>

              <Link className="block hover:text-purple-400 duration-300" to="/blog">
                Blog
              </Link>

              <Link className="block hover:text-purple-400 duration-300" to="/about">
                About
              </Link>

              <Link className="block hover:text-purple-400 duration-300" to="/support">
                Contact
              </Link>

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6 border-l-4 border-pink-500 pl-3">
              Our Services
            </h3>

            <div className="space-y-4">

              <p>Wedding Photography</p>

              <p>Pre Wedding Shoot</p>

              <p>Cinematic Videos</p>

              <p>Digital Album</p>

              <p>Cloud Gallery</p>

              <p>Live Event Gallery</p>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-6 border-l-4 border-indigo-500 pl-3">
              Contact Us
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">

                <FaMapMarkerAlt className="text-purple-400 mt-1" />

                <p>
                  Begusarai,
                  <br />
                  Bihar, India
                </p>

              </div>

              <div className="flex gap-3">

                <FaPhoneAlt className="text-green-400 mt-1" />

                <p>+91 9876543210</p>

              </div>

              <div className="flex gap-3">

                <FaEnvelope className="text-pink-400 mt-1" />

                <p>support@albumstudio.com</p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800">

        <div className="w-full max-w-7xl mx-auto min-w-0 px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">

          <p className="text-gray-500 text-sm">
            © 2026 Album Studio. All Rights Reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">

            <Link
              to="/privacy-policy"
              className="hover:text-purple-400"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-purple-400"
            >
              Terms & Conditions
            </Link>

            <Link
              to="/support"
              className="hover:text-purple-400"
            >
              Support
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;