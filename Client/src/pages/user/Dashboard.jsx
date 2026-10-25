import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "./Banner";
import Album from "./Album";
import Blog from "./Blog";
import Testimonials from "./Testimonials";

import {
  FaImages,
  FaPhotoVideo,
  FaDownload,
  FaHeart,
  FaArrowRight,
  FaImage,
  FaVideo,
} from "react-icons/fa";

import { getAllEventByFilter } from "../../app/event/eventThunk";
import { getMediaByFilter } from "../../app/media/mediaThunk";
import { getMyFavorites } from "../../app/slectedmedia/slectedmediaThunk";
import { getDownloads } from "../../utils/downloadHelper";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Redux state
  const events = useSelector((state) => state.event?.events) || [];
  const medias = useSelector((state) => state.media?.medias) || [];
  const favorites = useSelector((state) => state.slectedmedia?.favorites) || [];

  // Local state for downloads (dynamic from downloadHelper / localStorage)
  const [downloads, setDownloads] = useState([]);

  // Fetch all user data on dashboard mount
  useEffect(() => {
    dispatch(getAllEventByFilter({ limit: 100 }));
    dispatch(getMediaByFilter({ limit: 1000 }));
    dispatch(getMyFavorites());

    // Load downloads
    setDownloads(getDownloads() || []);

    const handleDownloadsUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setDownloads(e.detail);
      } else {
        setDownloads(getDownloads() || []);
      }
    };

    window.addEventListener("downloads_updated", handleDownloadsUpdate);
    return () => {
      window.removeEventListener("downloads_updated", handleDownloadsUpdate);
    };
  }, [dispatch]);

  // Derived calculations with safe fallbacks
  const safeEvents = Array.isArray(events) ? events : [];
  const safeMedias = Array.isArray(medias) ? medias : [];
  const safeDownloads = Array.isArray(downloads) ? downloads : [];
  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  const totalAlbumsCount = safeEvents.length;

  const totalPhotosCount = safeMedias.filter(
    (m) => m && (m.videosOrImageUrlType === "Image" || !m.videosOrImageUrlType)
  ).length;

  const totalVideosCount = safeMedias.filter(
    (m) => m && m.videosOrImageUrlType === "Video"
  ).length;

  const totalMediaCount = safeMedias.length || totalPhotosCount + totalVideosCount;

  const totalDownloadsCount = safeDownloads.length;
  const downloadedPhotosCount = safeDownloads.filter((d) => d && d.type === "Image").length;
  const downloadedVideosCount = safeDownloads.filter((d) => d && d.type === "Video").length;

  const totalFavoritesCount = safeFavorites.length;

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Banner */}
      <Banner />

      {/* Dynamic & Clickable Stats Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Overview & Quick Access
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Click any card to explore
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* 1. Total Albums Card */}
          <Link
            to="/albums"
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-white border border-indigo-100/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                <FaImages />
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/50 flex items-center gap-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                View All <FaArrowRight className="text-[10px]" />
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {totalAlbumsCount}
              </h3>
              <p className="font-bold text-gray-800 mt-1 text-base">
                Total Albums
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalAlbumsCount === 1 ? "1 active event album" : `${totalAlbumsCount} active event albums`}
              </p>
            </div>
          </Link>

          {/* 2. Photos & Videos Card */}
          <Link
            to="/albums"
            className="group relative overflow-hidden bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-white border border-pink-100/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-pink-200 group-hover:scale-110 transition-transform duration-300">
                <FaPhotoVideo />
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-200/50 flex items-center gap-1 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                Browse <FaArrowRight className="text-[10px]" />
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {totalMediaCount}
              </h3>
              <p className="font-bold text-gray-800 mt-1 text-base">
                Photos & Videos
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <FaImage className="text-pink-500 text-[10px]" /> {totalPhotosCount} Photos
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FaVideo className="text-rose-500 text-[10px]" /> {totalVideosCount} Videos
                </span>
              </div>
            </div>
          </Link>

          {/* 3. Downloads Card */}
          <Link
            to="/downloads"
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border border-emerald-100/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
                <FaDownload />
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/50 flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                Downloads <FaArrowRight className="text-[10px]" />
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {totalDownloadsCount}
              </h3>
              <p className="font-bold text-gray-800 mt-1 text-base">
                Downloaded Files
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span>{downloadedPhotosCount} Photos</span>
                <span>•</span>
                <span>{downloadedVideosCount} Videos</span>
              </div>
            </div>
          </Link>

          {/* 4. Favorites Card */}
          <Link
            to="/favorites"
            className="group relative overflow-hidden bg-gradient-to-br from-red-500/10 via-orange-500/5 to-white border border-red-100/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-red-200 group-hover:scale-110 transition-transform duration-300">
                <FaHeart />
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-200/50 flex items-center gap-1 group-hover:bg-red-600 group-hover:text-white transition-colors">
                Favorites <FaArrowRight className="text-[10px]" />
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {totalFavoritesCount}
              </h3>
              <p className="font-bold text-gray-800 mt-1 text-base">
                Favorite Media
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalFavoritesCount === 1 ? "1 selected memory" : `${totalFavoritesCount} selected memories`}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Albums Section */}
      <div>
        <Album />
      </div>

      {/* Blog Section */}
      <div>
        <Blog />
      </div>

      {/* Testimonials Section */}
      <div>
        <Testimonials />
      </div>
    </div>
  );
};

export default Dashboard;