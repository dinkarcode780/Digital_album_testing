import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaStore,
  FaSearch,
  FaStar,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaImages,
  FaServicestack,
  FaNewspaper,
  FaQuoteLeft,
  FaShieldAlt,
  FaFilter,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaSync,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";

const SuperAdminStudioShowcases = () => {
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchShowcases = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/super-admin/studio-showcases");
      if (res.data?.success) {
        setShowcases(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load studio showcases:", err);
      toast.error("Failed to fetch studio showcases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowcases();
  }, []);

  const handleToggleFeatured = async (adminId) => {
    try {
      setActionLoading(true);
      const res = await axiosInstance.patch(`/super-admin/studio-showcase/${adminId}/feature`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setShowcases((prev) =>
          prev.map((item) =>
            item.admin._id === adminId
              ? { ...item, profile: { ...item.profile, isFeatured: !item.profile.isFeatured } }
              : item
          )
        );
      }
    } catch (err) {
      toast.error("Failed to update featured status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublic = async (adminId) => {
    try {
      setActionLoading(true);
      const res = await axiosInstance.patch(`/super-admin/studio-showcase/${adminId}/visibility`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setShowcases((prev) =>
          prev.map((item) =>
            item.admin._id === adminId
              ? { ...item, profile: { ...item.profile, isPublic: !item.profile.isPublic } }
              : item
          )
        );
      }
    } catch (err) {
      toast.error("Failed to update public status");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredShowcases = showcases.filter((item) => {
    const nameMatch =
      item.profile?.studioName?.toLowerCase().includes(search.toLowerCase()) ||
      item.admin?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.admin?.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.profile?.city?.toLowerCase().includes(search.toLowerCase());

    if (!nameMatch) return false;

    if (statusFilter === "featured") return item.profile?.isFeatured;
    if (statusFilter === "public") return item.profile?.isPublic;
    if (statusFilter === "hidden") return !item.profile?.isPublic;

    return true;
  });

  const totalStudios = showcases.length;
  const publicCount = showcases.filter((s) => s.profile?.isPublic).length;
  const featuredCount = showcases.filter((s) => s.profile?.isFeatured).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold tracking-wide uppercase mb-2">
            <FaShieldAlt /> Marketplace & Showcase Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Public Studio Showcases
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Super Admin control center to inspect, moderate, feature, and verify public photography portfolios published by all Studio Admins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/studios"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-black text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
          >
            <FaExternalLinkAlt className="text-xs" />
            Open Public Directory
          </Link>
          <button
            onClick={fetchShowcases}
            disabled={loading}
            className="p-2.5 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            title="Refresh List"
          >
            <FaSync className={`text-base ${loading ? "animate-spin text-purple-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold shadow-inner">
            <FaStore />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Studios</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalStudios}</h3>
            <p className="text-xs text-gray-500 mt-1">Registered Photography Admins</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold shadow-inner">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Live on Public Panel</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{publicCount}</h3>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Visible to Guests</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold shadow-inner">
            <FaStar />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Featured Badged</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{featuredCount}</h3>
            <p className="text-xs text-amber-600 mt-1 font-medium">Highlighted on Directory</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search studio, admin name, city, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <FaFilter /> Filter:
          </span>
          {[
            { id: "all", label: "All Studios" },
            { id: "public", label: "Live Only" },
            { id: "featured", label: "Featured" },
            { id: "hidden", label: "Hidden" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Studios Table / List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center">
          <div className="inline-block animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500 font-medium">Loading studio showcases...</p>
        </div>
      ) : filteredShowcases.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">
            <FaStore />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No studios found</h3>
          <p className="text-gray-500 text-sm mt-1">Try clearing or adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShowcases.map((item) => {
            const { admin, profile, servicesCount, blogsCount, testimonialsCount, demoAlbumsCount } = item;
            return (
              <div
                key={admin._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Banner / Header */}
                <div className="relative h-32 bg-gray-900 overflow-hidden">
                  <img
                    src={profile?.coverBanner || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"}
                    alt={profile?.studioName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {profile?.isFeatured && (
                      <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <FaStar /> Featured
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 ${
                        profile?.isPublic ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      {profile?.isPublic ? "Live Public" : "Hidden"}
                    </span>
                  </div>

                  {/* Logo overlay */}
                  <div className="absolute -bottom-4 left-5 flex items-center gap-3">
                    <img
                      src={profile?.logo || admin?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                      alt={profile?.studioName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
                    />
                  </div>
                </div>

                {/* Body Content */}
                <div className="pt-6 p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-snug hover:text-purple-600 transition">
                          {profile?.studioName || admin?.name}
                        </h3>
                        <p className="text-xs text-purple-600 font-semibold mt-0.5">
                          {profile?.tagline || "Professional Photography Studio"}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 mt-2.5 leading-relaxed">
                      {profile?.aboutBio || "No bio description provided yet."}
                    </p>

                    {/* Admin Meta */}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-purple-500 shrink-0" />
                        <span className="truncate">{profile?.city || "City Not Set"}, {profile?.state || "India"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-indigo-500 shrink-0" />
                        <span className="truncate">{admin?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhoneAlt className="text-emerald-500 shrink-0" />
                        <span className="truncate">{profile?.phoneNumber || admin?.phoneNumber || "No phone"}</span>
                      </div>
                    </div>

                    {/* Content Counters */}
                    <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
                      <div className="p-2 rounded-xl bg-purple-50/60">
                        <FaImages className="text-purple-600 text-xs mx-auto mb-1" />
                        <span className="block font-bold text-xs text-gray-900">{demoAlbumsCount}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Albums</span>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-50/60">
                        <FaServicestack className="text-blue-600 text-xs mx-auto mb-1" />
                        <span className="block font-bold text-xs text-gray-900">{servicesCount}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Services</span>
                      </div>
                      <div className="p-2 rounded-xl bg-pink-50/60">
                        <FaNewspaper className="text-pink-600 text-xs mx-auto mb-1" />
                        <span className="block font-bold text-xs text-gray-900">{blogsCount}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Stories</span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50/60">
                        <FaQuoteLeft className="text-amber-600 text-xs mx-auto mb-1" />
                        <span className="block font-bold text-xs text-gray-900">{testimonialsCount}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Reviews</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Controls */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleToggleFeatured(admin._id)}
                        disabled={actionLoading}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          profile?.isFeatured
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                        }`}
                      >
                        <FaStar />
                        {profile?.isFeatured ? "Unfeature" : "Feature"}
                      </button>

                      <button
                        onClick={() => handleTogglePublic(admin._id)}
                        disabled={actionLoading}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          profile?.isPublic
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {profile?.isPublic ? <FaTimesCircle /> : <FaCheckCircle />}
                        {profile?.isPublic ? "Hide Public" : "Make Public"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/studio/${admin._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-200"
                      >
                        <FaEye /> View Public Showcase
                      </Link>
                      <button
                        onClick={() => setSelectedStudio(item)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition"
                      >
                        Quick Peek
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Peek Drawer / Modal */}
      {selectedStudio && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
            {/* Modal Header */}
            <div className="relative h-44 bg-gray-900 overflow-hidden shrink-0">
              <img
                src={selectedStudio.profile?.coverBanner || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"}
                alt=""
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedStudio(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 flex items-center gap-4">
                <img
                  src={selectedStudio.profile?.logo || selectedStudio.admin?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xl bg-white"
                />
                <div className="text-white">
                  <h2 className="text-xl font-bold">{selectedStudio.profile?.studioName || selectedStudio.admin?.name}</h2>
                  <p className="text-xs text-purple-200">{selectedStudio.profile?.tagline}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">About Bio</h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {selectedStudio.profile?.aboutBio || "No description written yet."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudio.profile?.specialties?.length > 0 ? (
                    selectedStudio.profile.specialties.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl">
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Wedding, Pre-Wedding, Cinematic Video</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Starting Price</span>
                  <p className="text-lg font-bold text-gray-900 mt-1">₹{selectedStudio.profile?.pricingStartingFrom?.toLocaleString() || "15,000"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Experience</span>
                  <p className="text-lg font-bold text-gray-900 mt-1">{selectedStudio.profile?.experienceYears || 5}+ Years</p>
                </div>
              </div>

              {/* Showcase demo albums */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Demo Showcase Albums ({selectedStudio.demoAlbumsCount})
                </h4>
                {selectedStudio.profile?.showcaseAlbums?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {selectedStudio.profile.showcaseAlbums.map((album, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-gray-200 relative aspect-video group">
                        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 p-2 flex flex-col justify-end text-white text-[11px] font-bold">
                          <span className="truncate">{album.title}</span>
                          <span className="text-[9px] text-purple-300 font-normal">{album.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No showcase albums added yet.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <Link
                to={`/studio/${selectedStudio.admin._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition"
              >
                <FaExternalLinkAlt /> Open Full Live Profile
              </Link>
              <button
                onClick={() => setSelectedStudio(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminStudioShowcases;
