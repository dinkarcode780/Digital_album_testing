import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCamera,
  FaImages,
  FaServicestack,
  FaCommentDots,
  FaGlobe,
  FaSave,
  FaPlus,
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaStar,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";

export default function StudioProfileManager() {
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'albums' | 'services' | 'testimonials'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    studioName: "",
    tagline: "",
    aboutBio: "",
    logo: "",
    coverBanner: "",
    phoneNumber: "",
    whatsappNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    experienceYears: 5,
    eventsCompleted: 100,
    specialties: [],
    pricingStartingFrom: 25000,
    googleMapLink: "",
    instagram: "",
    facebook: "",
    youtube: "",
    websiteUrl: "",
    isPublic: true,
    showcaseAlbums: [],
  });

  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Modal states
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [albumForm, setAlbumForm] = useState({
    title: "",
    category: "Wedding",
    coverImage: "",
    description: "",
    mediaUrlsText: "",
  });

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    price: "",
    description: "",
    features: [],
    icon: "FaCamera",
  });
  const [serviceFeatureInput, setServiceFeatureInput] = useState("");

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    clientName: "",
    clientRole: "Wedding Couple",
    rating: 5,
    feedback: "",
    eventName: "Grand Wedding",
  });

  const [specialtyInput, setSpecialtyInput] = useState("");

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/studio-profile");
      const data = res.data?.data || {};
      if (data.profile) {
        setProfile((prev) => ({ ...prev, ...data.profile }));
      }
      setServices(data.services || []);
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error("Error loading studio profile:", error);
      toast.error("Failed to load studio profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await axiosInstance.put("/admin/studio-profile", profile);
      toast.success("Studio profile and company showcase saved successfully!");
      await loadProfileData();
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Specialty Add / Remove
  const handleAddSpecialty = () => {
    if (!specialtyInput.trim()) return;
    if (!profile.specialties.includes(specialtyInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()],
      }));
    }
    setSpecialtyInput("");
  };

  const handleRemoveSpecialty = (item) => {
    setProfile((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== item),
    }));
  };

  // Demo Showcase Album Add / Delete
  const handleAddAlbumSubmit = async (e) => {
    e.preventDefault();
    if (!albumForm.title || !albumForm.coverImage) {
      toast.error("Album title and cover image URL are required");
      return;
    }

    const mediaUrls = albumForm.mediaUrlsText
      ? albumForm.mediaUrlsText.split("\n").map((u) => u.trim()).filter(Boolean)
      : [albumForm.coverImage];

    try {
      setSaving(true);
      await axiosInstance.post("/admin/studio-showcase/albums", {
        title: albumForm.title,
        category: albumForm.category,
        coverImage: albumForm.coverImage,
        description: albumForm.description,
        mediaUrls,
      });

      toast.success("Showcase demo album added successfully!");
      setShowAlbumModal(false);
      setAlbumForm({
        title: "",
        category: "Wedding",
        coverImage: "",
        description: "",
        mediaUrlsText: "",
      });
      await loadProfileData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add showcase album");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Remove this showcase album from your public profile?")) return;
    try {
      await axiosInstance.delete(`/admin/studio-showcase/albums/${albumId}`);
      toast.success("Showcase album removed");
      await loadProfileData();
    } catch (error) {
      toast.error("Failed to remove album");
    }
  };

  // Services Add / Delete
  const handleAddServiceFeature = () => {
    if (!serviceFeatureInput.trim()) return;
    setServiceForm((prev) => ({
      ...prev,
      features: [...prev.features, serviceFeatureInput.trim()],
    }));
    setServiceFeatureInput("");
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.title) {
      toast.error("Service title is required");
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.post("/admin/studio-services", serviceForm);
      toast.success("Service package added successfully!");
      setShowServiceModal(false);
      setServiceForm({
        title: "",
        price: "",
        description: "",
        features: [],
        icon: "FaCamera",
      });
      await loadProfileData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add service");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Delete this service package?")) return;
    try {
      await axiosInstance.delete(`/admin/studio-services/${serviceId}`);
      toast.success("Service package deleted");
      await loadProfileData();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  // Testimonial Add / Delete
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.clientName || !testimonialForm.feedback) {
      toast.error("Client name and feedback are required");
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.post("/admin/studio-testimonials", testimonialForm);
      toast.success("Client review added successfully!");
      setShowTestimonialModal(false);
      setTestimonialForm({
        clientName: "",
        clientRole: "Wedding Couple",
        rating: 5,
        feedback: "",
        eventName: "Grand Wedding",
      });
      await loadProfileData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestimonial = async (testId) => {
    if (!window.confirm("Delete this client review?")) return;
    try {
      await axiosInstance.delete(`/admin/studio-testimonials/${testId}`);
      toast.success("Review deleted");
      await loadProfileData();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <FaSpinner className="animate-spin text-purple-600 text-4xl mx-auto mb-3" />
        <p className="text-gray-500 font-semibold text-sm">Loading studio profile settings...</p>
      </div>
    );
  }

  const adminId = profile.adminId || "";

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaGlobe /> Public Marketplace Showcase
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Studio Public Profile & Showcase Manager
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Customize what potential clients see on the public studio discovery portal: your branding, demo albums, packages, and reviews.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/studio/${adminId}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2.5 rounded-2xl font-bold text-xs transition"
          >
            <FaEye />
            <span>View Live Public Profile</span>
            <FaExternalLinkAlt className="text-[10px]" />
          </Link>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 transition disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: "info", label: "Studio Info & Branding", icon: <FaCamera /> },
          { id: "albums", label: `Demo Showcase Albums (${profile.showcaseAlbums?.length || 0})`, icon: <FaImages /> },
          { id: "services", label: `Services & Packages (${services.length})`, icon: <FaServicestack /> },
          { id: "testimonials", label: `Client Reviews (${testimonials.length})`, icon: <FaCommentDots /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDIO INFO & BRANDING */}
      {/* ========================================================================= */}
      {activeTab === "info" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
              Brand Identity & Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Studio / Brand Name *
                </label>
                <input
                  type="text"
                  name="studioName"
                  required
                  value={profile.studioName}
                  onChange={handleProfileChange}
                  placeholder="e.g. Royal Cinematic Wedding Studio"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={profile.tagline}
                  onChange={handleProfileChange}
                  placeholder="e.g. Preserving memories with royal elegance"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                About Studio Story & Bio
              </label>
              <textarea
                name="aboutBio"
                rows={3}
                value={profile.aboutBio}
                onChange={handleProfileChange}
                placeholder="Tell potential clients about your experience, photography style, cameras/equipment, and passion..."
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
              />
            </div>

            {/* Images: Logo and Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Studio Logo / Avatar URL
                </label>
                <input
                  type="text"
                  name="logo"
                  value={profile.logo}
                  onChange={handleProfileChange}
                  placeholder="https://... logo image link"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Cover Banner Image URL
                </label>
                <input
                  type="text"
                  name="coverBanner"
                  value={profile.coverBanner}
                  onChange={handleProfileChange}
                  placeholder="https://... wide banner image link"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Contact numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Direct Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleProfileChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={profile.whatsappNumber}
                  onChange={handleProfileChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Public Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="studio@gmail.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                  placeholder="e.g. Jaipur, Delhi, Mumbai"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Studio Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  placeholder="e.g. 2nd Floor, Crystal Mall, MI Road"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Stats & Starting Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  name="experienceYears"
                  value={profile.experienceYears}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Total Shoots Completed
                </label>
                <input
                  type="number"
                  min="0"
                  name="eventsCompleted"
                  value={profile.eventsCompleted}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Starting Price in INR (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  name="pricingStartingFrom"
                  value={profile.pricingStartingFrom}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Specialties / Styles
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Destination Weddings, Aerial Drone..."
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(profile.specialties || []).map((spec, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(spec)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Social Media & Web Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Instagram Handle / URL</label>
                  <input
                    type="text"
                    name="instagram"
                    value={profile.instagram}
                    onChange={handleProfileChange}
                    placeholder="e.g. royalstudio_official"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Google Maps Location Link</label>
                  <input
                    type="text"
                    name="googleMapLink"
                    value={profile.googleMapLink}
                    onChange={handleProfileChange}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">YouTube Channel URL</label>
                  <input
                    type="text"
                    name="youtube"
                    value={profile.youtube}
                    onChange={handleProfileChange}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Switch */}
            <div className="pt-4 border-t flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">Show on Public Studios Directory</p>
                <p className="text-xs text-gray-500">Allow visitors to find and view your studio on the marketplace</p>
              </div>
              <input
                type="checkbox"
                name="isPublic"
                checked={profile.isPublic}
                onChange={handleProfileChange}
                className="w-6 h-6 text-purple-600 rounded-lg focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md shadow-purple-500/20 transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <FaSpinner className="animate-spin" />}
              <span>Save Studio Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEMO SHOWCASE ALBUMS */}
      {/* ========================================================================= */}
      {activeTab === "albums" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Demo Showcase Portfolio Albums</h3>
              <p className="text-xs text-gray-500">Add sample albums to wow prospective clients who visit your profile</p>
            </div>

            <button
              onClick={() => setShowAlbumModal(true)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 transition"
            >
              <FaPlus />
              <span>Add Showcase Album</span>
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(profile.showcaseAlbums || []).map((album) => (
              <div
                key={album._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-gray-100 relative overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase">
                      {album.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h4 className="font-bold text-sm text-gray-900">{album.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{album.description}</p>
                    <p className="text-[11px] text-purple-600 font-bold mt-2">
                      {(album.mediaUrls || []).length || 1} High-Res Sample Photos
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteAlbum(album._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition text-xs font-bold flex items-center gap-1"
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SERVICES & PACKAGES */}
      {/* ========================================================================= */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Photography Packages & Services</h3>
              <p className="text-xs text-gray-500">Define packages clients can browse and book directly</p>
            </div>

            <button
              onClick={() => setShowServiceModal(true)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 transition"
            >
              <FaPlus />
              <span>Add New Package</span>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((srv) => (
              <div
                key={srv._id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-base text-gray-900">{srv.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{srv.description}</p>
                  <p className="text-xl font-black text-purple-600 mt-3">
                    ₹{srv.price?.toLocaleString("en-IN") || 0}
                  </p>

                  <div className="mt-4 space-y-1.5 border-t pt-3">
                    {(srv.features || []).map((feat, idx) => (
                      <p key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-500 text-[10px]" />
                        <span>{feat}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t flex justify-end">
                  <button
                    onClick={() => handleDeleteService(srv._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                  >
                    <FaTrash /> <span>Delete Package</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CLIENT TESTIMONIALS */}
      {/* ========================================================================= */}
      {activeTab === "testimonials" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Client Reviews & Testimonials</h3>
              <p className="text-xs text-gray-500">Showcase 5-star ratings and reviews from past clients</p>
            </div>

            <button
              onClick={() => setShowTestimonialModal(true)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 transition"
            >
              <FaPlus />
              <span>Add Client Review</span>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">{t.clientName}</span>
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{t.eventName} · {t.clientRole}</p>
                  <p className="text-xs text-gray-700 italic">"{t.feedback}"</p>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-end">
                  <button
                    onClick={() => handleDeleteTestimonial(t._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD SHOWCASE ALBUM */}
      {/* ========================================================================= */}
      {showAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Demo Showcase Album</h3>
              <button onClick={() => setShowAlbumModal(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddAlbumSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Destination Wedding in Jaipur"
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  value={albumForm.category}
                  onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Pre-Wedding">Pre-Wedding</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Ceremony">Ceremony</option>
                  <option value="Reception">Reception</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Photo URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://... cover image url"
                  value={albumForm.coverImage}
                  onChange={(e) => setAlbumForm({ ...albumForm, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Sample Photo URLs (One URL per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                  value={albumForm.mediaUrlsText}
                  onChange={(e) => setAlbumForm({ ...albumForm, mediaUrlsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. 2-day royal celebration..."
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAlbumModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
                >
                  Add Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD SERVICE PACKAGE */}
      {/* ========================================================================= */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Photography Package</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Day Wedding Photography"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief details about what this package offers..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              {/* Deliverable features */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Included Deliverables</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. 2 Photographers, 4K Teaser..."
                    value={serviceFeatureInput}
                    onChange={(e) => setServiceFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddServiceFeature();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-gray-50 border text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddServiceFeature}
                    className="px-3 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {serviceForm.features.map((f, i) => (
                    <div key={i} className="flex justify-between items-center px-2.5 py-1 bg-gray-50 rounded-lg text-xs">
                      <span>✓ {f}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setServiceForm((prev) => ({
                            ...prev,
                            features: prev.features.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD TESTIMONIAL */}
      {/* ========================================================================= */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Client Review</h3>
              <button onClick={() => setShowTestimonialModal(false)} className="text-gray-400 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akash & Neha Gupta"
                  value={testimonialForm.clientName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding Couple"
                    value={testimonialForm.clientRole}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating (1 to 5)</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Event Name</label>
                <input
                  type="text"
                  placeholder="e.g. Destination Wedding in Goa"
                  value={testimonialForm.eventName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, eventName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Client Feedback *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What the client said about your work, behavior, and photos..."
                  value={testimonialForm.feedback}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, feedback: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
