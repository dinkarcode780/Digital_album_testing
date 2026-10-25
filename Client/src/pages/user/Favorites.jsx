import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaImage,
  FaVideo,
  FaEye,
  FaSpinner,
  FaDownload,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getMyFavorites,
  toggleMediaSelection,
} from "../../app/slectedmedia/slectedmediaThunk";
import { downloadDirectMedia } from "../../utils/downloadHelper";

const Favorites = () => {
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [activeMedia, setActiveMedia] = useState(null);

  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.slectedmedia);

  // Fetch favorites on mount
  useEffect(() => {
    dispatch(getMyFavorites());
  }, [dispatch]);

  // Handle Remove from Favorites
  const handleRemoveFavorite = async (item) => {
    try {
      const res = await dispatch(
        toggleMediaSelection({
          mediaId: item.mediaId,
          eventId: item.eventId,
        })
      ).unwrap();

      if (res.success) {
        toast.info("Removed from favorites");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to remove from favorites");
    }
  };

  // Filter & Search
  const filteredFavorites = (favorites || []).filter((item) => {
    if (filterType === "Photos" && item.type !== "Image") return false;
    if (filterType === "Videos" && item.type !== "Video") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const titleMatch = item.eventTitle?.toLowerCase().includes(q);
      const locMatch = item.location?.toLowerCase().includes(q);
      const commentMatch = item.comment?.toLowerCase().includes(q);
      return titleMatch || locMatch || commentMatch;
    }
    return true;
  });

  const photoCount = (favorites || []).filter((f) => f.type === "Image").length;
  const videoCount = (favorites || []).filter((f) => f.type === "Video").length;

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      {/* Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-red-500">❤️</span> Favorites
          </h1>
          <p className="text-gray-500 mt-1">
            Your favourite photos & videos selected across all albums
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by event title, location..."
          className="border border-gray-200 rounded-xl px-4 py-2.5 w-full md:w-80 outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mt-8 flex-wrap items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilterType("All")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filterType === "All"
                ? "bg-purple-600 text-white shadow"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All ({(favorites || []).length})
          </button>

          <button
            onClick={() => setFilterType("Photos")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filterType === "Photos"
                ? "bg-purple-600 text-white shadow"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Photos ({photoCount})
          </button>

          <button
            onClick={() => setFilterType("Videos")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filterType === "Videos"
                ? "bg-purple-600 text-white shadow"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Videos ({videoCount})
          </button>
        </div>

        <div className="text-sm text-gray-500">
          Showing <strong>{filteredFavorites.length}</strong> items
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-purple-600">
          <FaSpinner className="animate-spin text-4xl mb-3" />
          <p className="text-gray-500 font-medium">Loading your favorites...</p>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border mt-8 shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ❤️
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Favorites Found
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {search
              ? "No favorite media matched your search query."
              : "You haven't added any photos or videos to your favorites yet. Heart items in your albums to see them here!"}
          </p>
          <Link
            to="/albums"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition shadow-md"
          >
            Browse Albums
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
          {filteredFavorites.map((item, idx) => {
            const formattedDate = item.eventDate
              ? new Date(item.eventDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "";

            return (
              <div
                key={`${item.mediaId}-${idx}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl duration-300 overflow-hidden border border-gray-100 flex flex-col group"
              >
                {/* Media Thumbnail */}
                <div className="relative overflow-hidden bg-black h-56 flex items-center justify-center">
                  {item.type === "Video" ? (
                    <video
                      src={item.url}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <img
                      src={item.url || item.thumbnail}
                      alt={item.eventTitle}
                      className="w-full h-56 object-cover group-hover:scale-105 duration-300"
                    />
                  )}

                  {/* Heart / Unfavorite Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(item)}
                    title="Remove from favorites"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full text-red-500 shadow-md transition transform hover:scale-110"
                  >
                    <FaHeart className="text-base" />
                  </button>

                  {/* Type Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-medium">
                    {item.type === "Image" ? <FaImage /> : <FaVideo />}
                    {item.type}
                  </div>

                  {/* Download Icon if enabled */}
                  {item.isDownloadable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadDirectMedia(
                          item.url,
                          `${item.eventTitle || "favorite"}_${item.mediaId?.slice(-4)}`,
                          {
                            mediaId: item.mediaId,
                            title: `${item.eventTitle || "Favorite"} - ${item.type}`,
                            albumTitle: item.eventTitle || "Favorites",
                            type: item.type || "Image",
                            size: item.size || (item.type === "Video" ? "60 MB" : "3.6 MB"),
                            url: item.url,
                            thumbnail: item.thumbnail || item.url,
                            eventId: item.eventId,
                          }
                        );
                        toast.success("Download started & added to Downloads!");
                      }}
                      title="Download"
                      className="absolute top-3 left-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition backdrop-blur-sm shadow-md cursor-pointer"
                    >
                      <FaDownload className="text-xs" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
                      {item.eventTitle || "Album Media"}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      {formattedDate && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-purple-500" />
                          {formattedDate}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-red-400" />
                          {item.location}
                        </span>
                      )}
                    </div>

                    {item.comment && (
                      <p className="text-xs text-gray-600 mt-2 italic line-clamp-2 bg-gray-50 p-2 rounded-lg">
                        "{item.comment}"
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveMedia(item)}
                    className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition shadow-md"
                  >
                    <FaEye />
                    View Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Fullscreen Preview Modal */}
      {activeMedia && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-3 rounded-full z-10 transition"
            >
              <FaTimes className="text-lg" />
            </button>

            {/* Media Content */}
            <div className="flex items-center justify-center min-h-[300px] max-h-[70vh] bg-black">
              {activeMedia.type === "Video" ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia.url || activeMedia.thumbnail}
                  alt={activeMedia.eventTitle}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              )}
            </div>

            {/* Modal Footer Info */}
            <div className="p-5 bg-neutral-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {activeMedia.eventTitle}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {activeMedia.location ? `${activeMedia.location} • ` : ""}
                  {activeMedia.eventDate
                    ? new Date(activeMedia.eventDate).toLocaleDateString()
                    : ""}
                </p>
              </div>

              <div className="flex gap-3">
                {activeMedia.isDownloadable && (
                  <button
                    type="button"
                    onClick={() =>
                      downloadDirectMedia(
                        activeMedia.url,
                        `${activeMedia.eventTitle || "media"}_${activeMedia.mediaId?.slice(-4)}`
                      )
                    }
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                  >
                    <FaDownload /> Download
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveMedia(null)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;