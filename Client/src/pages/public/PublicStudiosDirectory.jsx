import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaImages,
  FaServicestack,
  FaArrowRight,
  FaPhoneAlt,
  FaWhatsapp,
  FaCheckCircle,
  FaCrown,
  FaSpinner,
  FaSlidersH,
  FaCamera,
  FaCalendarAlt,
  FaUserFriends,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function PublicStudiosDirectory() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    specialties: ["Wedding", "Pre-Wedding", "Cinematography", "Engagement", "Event Shoots"],
  });

  const fetchStudios = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/public/studios", {
        params: {
          search: searchTerm,
          city: selectedCity,
          specialty: selectedSpecialty,
          sortBy,
        },
      });

      setStudios(res.data?.data?.studios || []);
      if (res.data?.data?.filterOptions) {
        setFilterOptions((prev) => ({
          cities: res.data.data.filterOptions.cities || prev.cities,
          specialties: res.data.data.filterOptions.specialties || prev.specialties,
        }));
      }
    } catch (error) {
      console.error("Error fetching public studios:", error);
      toast.error("Failed to load photography studios directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, [selectedCity, selectedSpecialty, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudios();
  };

  const user = useSelector((state) => state.auth.user);
  const admin = useSelector((state) => state.admin.admin);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 flex flex-col font-sans">
      {/* Public Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link to="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <FaCamera className="text-base sm:text-xl" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                Album Studio
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Public Studios Marketplace
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            <Link to="/" className="hover:text-purple-600 transition">
              Home
            </Link>
            <Link to="/studios" className="text-purple-600 font-bold">
              Explore Studios
            </Link>
          </div>

          {/* Auth Button */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            {user || admin ? (
              <Link
                to={admin ? (admin.userType === "SuperAdmin" ? "/super-admin/dashboard" : "/admin/dashboard") : "/user/dashboard"}
                className="whitespace-nowrap bg-purple-600 hover:bg-purple-700 px-2.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-white shadow-md shadow-purple-500/20 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="whitespace-nowrap px-2 py-2 sm:px-4 text-[10px] sm:text-xs font-bold text-gray-700 hover:text-purple-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/admin/register"
                  className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-2.5 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold text-white shadow-md shadow-purple-500/20 transition"
                >
                  <span className="sm:hidden">Partner Register</span>
                  <span className="hidden sm:inline">Studio Partner Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-950 to-gray-900 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-bold uppercase tracking-wider border border-white/10">
            <FaCrown className="text-amber-400" /> Discover Verified Photography Studios
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Find the Perfect Studio for Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Weddings & Dream Shoots
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Browse verified photography & cinematic studios, view high-res sample showcase albums, check packages & client reviews, and book instantly.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-2.5 rounded-3xl shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2 border border-white/20 text-gray-800"
          >
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search studio by name, location, or style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-purple-500 text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2"
            >
              <span>Search Studios</span>
              <FaArrowRight className="text-xs" />
            </button>
          </form>
        </div>
      </section>

      {/* Main Content & Directory Grid */}
      <main className="w-full max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Specialty Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedSpecialty("All")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                selectedSpecialty === "All"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              All Styles
            </button>
            {filterOptions.specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                  selectedSpecialty === spec
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* City Filter & Sorting */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* City Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-gray-700">
              <FaMapMarkerAlt className="text-purple-600 text-xs" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-0 focus:ring-0 cursor-pointer font-bold text-xs"
              >
                <option value="All">All Cities</option>
                {filterOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-2xl text-xs font-bold text-gray-700">
              <FaSlidersH className="text-gray-400 text-xs" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 focus:ring-0 cursor-pointer font-bold text-xs"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="price_low">Starting Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <FaSpinner className="animate-spin text-purple-600 text-4xl mx-auto mb-3" />
            <p className="text-gray-500 font-semibold text-sm">Discovering top photography studios...</p>
          </div>
        ) : studios.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaCamera />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Photography Studios Found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              No studios matched your current search filters. Try clearing your search query or city filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("All");
                setSelectedSpecialty("All");
                setSortBy("featured");
              }}
              className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-500/20"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => {
              return (
                <div
                  key={studio._id}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Banner Image with Overlay */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={studio.sampleAlbumCover || studio.coverBanner}
                        alt={studio.studioName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        {studio.isFeatured ? (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <FaCrown /> Featured Studio
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold">
                            {studio.experienceYears}+ Years Exp.
                          </span>
                        )}

                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                          <FaStar className="text-amber-500 text-xs" />
                          <span>{studio.rating}</span>
                          <span className="text-[10px] text-gray-400">({studio.reviewCount})</span>
                        </div>
                      </div>

                      {/* Location pill */}
                      <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white/90 text-xs font-semibold drop-shadow-sm">
                        <FaMapMarkerAlt className="text-purple-400 text-xs" />
                        <span>{studio.city || "Delhi NCR"}</span>
                      </div>
                    </div>

                    {/* Studio Header Info & Logo */}
                    <div className="p-6 pb-2">
                      <div className="flex items-start gap-3.5 -mt-12 relative z-10 mb-3">
                        <img
                          src={
                            studio.logo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              studio.studioName
                            )}&background=7c3aed&color=fff`
                          }
                          alt={studio.studioName}
                          className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white shrink-0"
                        />
                        <div className="pt-5 flex-1 min-w-0">
                          <h3 className="text-lg font-black text-gray-900 truncate group-hover:text-purple-600 transition">
                            {studio.studioName}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-500 text-xs line-clamp-2 min-h-[32px] leading-relaxed">
                        {studio.tagline || studio.aboutBio}
                      </p>

                      {/* Specialty Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(studio.specialties || []).slice(0, 3).map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-bold"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Highlights / Stats bar */}
                      <div className="mt-5 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 text-center text-gray-700 border border-gray-100">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Albums</p>
                          <p className="text-xs font-black text-gray-900 mt-0.5">
                            {studio.demoAlbumsCount} Showcase
                          </p>
                        </div>
                        <div className="border-x border-gray-200">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Packages</p>
                          <p className="text-xs font-black text-gray-900 mt-0.5">
                            {studio.servicesCount} Available
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Events</p>
                          <p className="text-xs font-black text-gray-900 mt-0.5">
                            {studio.eventsCompleted}+ Done
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA & Pricing */}
                  <div className="p-6 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase">Packages From</p>
                      <p className="text-base font-black text-gray-900">
                        ₹{studio.pricingStartingFrom.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <Link
                      to={`/studio/${studio.adminId}`}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 transition group-hover:translate-x-0.5"
                    >
                      <span>View Portfolio</span>
                      <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
