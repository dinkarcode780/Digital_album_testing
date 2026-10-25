import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FaDownload,
  FaImage,
  FaVideo,
  FaSearch,
  FaTrash,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaRedo,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaHdd,
  FaEye,
  FaLayerGroup,
  FaExpand,
  FaCompress,
  FaArrowRight,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../components/common/Pagination";
import {
  getDownloads,
  removeDownload,
  clearAllDownloads,
  downloadDirectMedia,
} from "../../utils/downloadHelper";

const Downloads = () => {
  const [downloadList, setDownloadList] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [downloadingId, setDownloadingId] = useState(null);

  // Lightbox / Zoom Modal State
  const [previewItem, setPreviewItem] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const modalContainerRef = useRef(null);

  // Load downloads from local storage & listen for real-time updates
  useEffect(() => {
    setDownloadList(getDownloads());

    const handleUpdate = (e) => {
      if (e.detail) {
        setDownloadList(e.detail);
      } else {
        setDownloadList(getDownloads());
      }
    };

    window.addEventListener("downloads_updated", handleUpdate);
    return () => {
      window.removeEventListener("downloads_updated", handleUpdate);
    };
  }, []);

  // Keyboard navigation & ESC for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!previewItem) return;

      if (e.key === "Escape") {
        closePreview();
      } else if (e.key === "ArrowLeft") {
        navigatePreview(-1);
      } else if (e.key === "ArrowRight") {
        navigatePreview(1);
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewItem, downloadList]);

  // Reset zoom & transform when active preview item changes
  const resetTransform = () => {
    setZoomScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const openPreview = (item) => {
    setPreviewItem(item);
    resetTransform();
  };

  const closePreview = () => {
    setPreviewItem(null);
    resetTransform();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.35, 4));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.35, 0.5);
      if (next <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;

    if (!document.fullscreenElement) {
      modalContainerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    if (!previewItem || previewItem.type === "Video") return;
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Drag & Pan handlers for zoomed image
  const handleMouseDown = (e) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomScale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click to toggle quick zoom
  const handleDoubleClick = () => {
    if (zoomScale > 1) {
      handleResetZoom();
    } else {
      setZoomScale(2);
    }
  };

  // Navigate next / previous in preview modal
  const navigatePreview = (direction) => {
    if (!previewItem) return;
    const currentList = filteredAndSortedList;
    const currentIndex = currentList.findIndex(
      (item) => item.id === previewItem.id
    );

    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = currentList.length - 1;
    if (nextIndex >= currentList.length) nextIndex = 0;

    setPreviewItem(currentList[nextIndex]);
    resetTransform();
  };

  // Handle Remove Item
  const handleRemove = (e, item) => {
    e.stopPropagation();
    const success = removeDownload(item.id);
    if (success) {
      toast.info(`Removed "${item.title || "item"}" from downloads.`);
      if (previewItem && previewItem.id === item.id) {
        closePreview();
      }
    }
  };

  // Handle Clear All
  const handleClearAll = () => {
    clearAllDownloads();
    setShowClearConfirm(false);
    toast.success("Download history cleared!");
    if (previewItem) closePreview();
  };

  // Handle Download Again
  const handleDownloadAgain = async (e, item) => {
    e.stopPropagation();
    try {
      setDownloadingId(item.id);
      await downloadDirectMedia(
        item.url,
        item.title || `${item.albumTitle || "media"}_${item.id}`,
        item
      );
      toast.success("Download started!");
    } catch (err) {
      toast.error("Download failed. Please try again.");
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  // Calculate stats
  const totalCount = downloadList.length;
  const photoCount = downloadList.filter((item) => item.type === "Image").length;
  const videoCount = downloadList.filter((item) => item.type === "Video").length;

  // Search & Filter & Sort
  const filteredAndSortedList = useMemo(() => {
    let result = [...downloadList];

    // Filter by Type
    if (filterType === "Photos") {
      result = result.filter((item) => item.type === "Image");
    } else if (filterType === "Videos") {
      result = result.filter((item) => item.type === "Video");
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(q);
        const albumMatch = item.albumTitle?.toLowerCase().includes(q);
        const typeMatch = item.type?.toLowerCase().includes(q);
        const dateMatch = item.date?.toLowerCase().includes(q);
        const sizeMatch = item.size?.toLowerCase().includes(q);
        return titleMatch || albumMatch || typeMatch || dateMatch || sizeMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (b.timestamp || 0) - (a.timestamp || 0);
      } else if (sortBy === "oldest") {
        return (a.timestamp || 0) - (b.timestamp || 0);
      } else if (sortBy === "title-asc") {
        return (a.title || "").localeCompare(b.title || "");
      } else if (sortBy === "title-desc") {
        return (b.title || "").localeCompare(a.title || "");
      } else if (sortBy === "size") {
        const parseSize = (str = "") => {
          const num = parseFloat(str) || 0;
          if (str.toLowerCase().includes("gb")) return num * 1024;
          return num;
        };
        return parseSize(b.size) - parseSize(a.size);
      }
      return 0;
    });

    return result;
  }, [downloadList, filterType, search, sortBy]);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filterType, sortBy, limit]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedList.length / limit) || 1;
  const paginatedDownloads = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAndSortedList.slice(start, start + limit);
  }, [filteredAndSortedList, page, limit]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <FaDownload className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                My Downloads
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                View, search, zoom & re-download your saved photos and videos
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions: Search & Clear */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, album, date..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {downloadList.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:text-white border border-red-200 hover:bg-red-600 rounded-xl transition shadow-sm whitespace-nowrap cursor-pointer"
              title="Clear all downloads"
            >
              <FaTrash />
              <span className="hidden sm:inline">Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-xs font-medium tracking-wide uppercase">
                Total Downloads
              </p>
              <h2 className="text-3xl font-extrabold mt-1">{totalCount}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
              <FaLayerGroup />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">
                Downloaded Photos
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                {photoCount}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              <FaImage />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">
                Downloaded Videos
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                {videoCount}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl">
              <FaVideo />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Limit Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mt-8 bg-gray-50/80 p-3 rounded-2xl border border-gray-200/70">
        {/* Type Tabs */}
        <div className="flex gap-2 flex-wrap items-center">
          {[
            { key: "All", label: "All Items", icon: FaLayerGroup, count: totalCount },
            { key: "Photos", label: "Photos", icon: FaImage, count: photoCount },
            { key: "Videos", label: "Videos", icon: FaVideo, count: videoCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filterType === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60"
                }`}
              >
                <Icon className="text-xs" />
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort & Limit */}
        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-end text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 font-medium cursor-pointer shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
              <option value="size">File Size (Largest)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 font-medium cursor-pointer shadow-sm"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Summary */}
      <div className="flex justify-between items-center mt-6 text-xs sm:text-sm text-gray-500">
        <div>
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredAndSortedList.length > 0
              ? (page - 1) * limit + 1
              : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-800">
            {Math.min(page * limit, filteredAndSortedList.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {filteredAndSortedList.length}
          </span>{" "}
          downloads
        </div>
        {search && (
          <div className="text-purple-600 font-medium">
            Search results for "{search}"
          </div>
        )}
      </div>

      {/* Media Cards Grid */}
      {paginatedDownloads.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 mt-6">
          <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            <FaDownload />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            No Downloads Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2 text-sm">
            {search || filterType !== "All"
              ? "No items match your active search or filter criteria. Try clearing filters to view all downloads."
              : "You haven't downloaded any photos or videos yet. Browse your albums and download your favorites!"}
          </p>

          <div className="flex justify-center gap-3 mt-6">
            {search || filterType !== "All" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterType("All");
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-purple-200 cursor-pointer"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                to="/albums"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-purple-200 cursor-pointer"
              >
                Browse Albums
                <FaArrowRight className="text-xs" />
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {paginatedDownloads.map((item) => {
            const isVideo = item.type === "Video";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
              >
                {/* Media Preview Container */}
                <div
                  className="relative h-56 bg-neutral-900 overflow-hidden cursor-pointer flex items-center justify-center"
                  onClick={() => openPreview(item)}
                >
                  {isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        src={item.url}
                        className="w-full h-56 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition transform">
                          ▶
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url || item.thumbnail}
                      alt={item.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}

                  {/* Top Left Type Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm z-10">
                    {isVideo ? (
                      <FaVideo className="text-red-400" />
                    ) : (
                      <FaImage className="text-purple-300" />
                    )}
                    <span>{item.type}</span>
                  </div>

                  {/* Top Right Quick Actions: Zoom Button & Remove */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(item);
                      }}
                      title={isVideo ? "Watch Video" : "Zoom & Inspect Image"}
                      className="p-2 rounded-full bg-black/60 hover:bg-purple-600 text-white backdrop-blur-md transition shadow-md cursor-pointer hover:scale-105"
                    >
                      {isVideo ? <FaEye className="text-xs" /> : <FaSearchPlus className="text-xs" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, item)}
                      title="Remove from history"
                      className="p-2 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition shadow-md cursor-pointer hover:scale-105"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>

                  {/* Hover Overlay Zoom Prompt */}
                  <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                      {isVideo ? <FaEye /> : <FaSearchPlus />}
                      {isVideo ? "Play Full Video" : "Click to Zoom"}
                    </span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-purple-600 transition"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {item.albumTitle && (
                      <p className="text-xs text-purple-600 font-semibold mt-1 line-clamp-1">
                        📁 {item.albumTitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-purple-400" />
                        <span>{item.date}</span>
                      </div>

                      {item.size && (
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-md font-mono text-[11px] text-gray-600">
                          <FaHdd className="text-gray-400" />
                          <span>{item.size}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 mt-5">
                    <button
                      type="button"
                      onClick={(e) => handleDownloadAgain(e, item)}
                      disabled={downloadingId === item.id}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-purple-200 cursor-pointer"
                    >
                      {downloadingId === item.id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <FaDownload />
                          <span>Download Again</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => openPreview(item)}
                      title={isVideo ? "Watch Preview" : "Zoom Photo"}
                      className="p-2.5 bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-xl transition cursor-pointer"
                    >
                      <FaExpand className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* ================= INTERACTIVE IMAGE ZOOM & MEDIA LIGHTBOX MODAL ================= */}
      {previewItem && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between"
          onClick={closePreview}
        >
          {/* Top Bar Controls */}
          <div
            className="w-full bg-black/60 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title & Metadata */}
            <div className="flex items-center gap-3 overflow-hidden mr-4">
              <div className="p-2 rounded-lg bg-white/10 text-purple-400">
                {previewItem.type === "Video" ? <FaVideo /> : <FaImage />}
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-sm sm:text-base text-white truncate">
                  {previewItem.title}
                </h4>
                <p className="text-xs text-gray-400 truncate">
                  {previewItem.albumTitle ? `${previewItem.albumTitle} • ` : ""}
                  {previewItem.date} {previewItem.size ? `• ${previewItem.size}` : ""}
                </p>
              </div>
            </div>

            {/* Zoom, Rotate, Fullscreen, Download & Close Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {previewItem.type !== "Video" && (
                <>
                  <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-1 gap-1">
                    <button
                      onClick={handleZoomOut}
                      title="Zoom Out (-)"
                      className="p-2 hover:bg-white/20 rounded-lg transition text-sm cursor-pointer"
                    >
                      <FaSearchMinus />
                    </button>

                    <button
                      onClick={handleResetZoom}
                      title="Reset Zoom (1x)"
                      className="px-2.5 py-1 hover:bg-white/20 rounded-lg transition text-xs font-mono font-bold cursor-pointer"
                    >
                      {Math.round(zoomScale * 100)}%
                    </button>

                    <button
                      onClick={handleZoomIn}
                      title="Zoom In (+)"
                      className="p-2 hover:bg-white/20 rounded-lg transition text-sm cursor-pointer"
                    >
                      <FaSearchPlus />
                    </button>
                  </div>

                  <button
                    onClick={handleRotate}
                    title="Rotate 90° Clockwise"
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-sm cursor-pointer"
                  >
                    <FaRedo />
                  </button>
                </>
              )}

              <button
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="hidden sm:block p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-sm cursor-pointer"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>

              <button
                onClick={(e) => handleDownloadAgain(e, previewItem)}
                title="Download Media"
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-lg shadow-purple-900/50"
              >
                <FaDownload className="text-xs" />
                <span className="hidden md:inline">Download</span>
              </button>

              <button
                onClick={closePreview}
                title="Close (Esc)"
                className="p-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition cursor-pointer"
              >
                <FaTimes className="text-base" />
              </button>
            </div>
          </div>

          {/* Central Media Canvas with Zoom / Pan / Drag support */}
          <div
            ref={modalContainerRef}
            className="relative flex-1 flex items-center justify-center overflow-hidden select-none p-4"
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor:
                previewItem.type === "Video"
                  ? "default"
                  : zoomScale > 1
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "default",
            }}
          >
            {/* Previous Arrow */}
            {filteredAndSortedList.length > 1 && (
              <button
                onClick={() => navigatePreview(-1)}
                title="Previous (Left Arrow)"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition z-30 shadow-xl border border-white/10 cursor-pointer hover:scale-110"
              >
                <FaChevronLeft className="text-lg" />
              </button>
            )}

            {/* Media Content */}
            {previewItem.type === "Video" ? (
              <div className="max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl bg-black outline-none"
                />
              </div>
            ) : (
              <div
                className="transition-transform duration-75 flex items-center justify-center max-w-full max-h-full"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoomScale}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
                onDoubleClick={handleDoubleClick}
              >
                <img
                  src={previewItem.url || previewItem.thumbnail}
                  alt={previewItem.title}
                  className="max-h-[78vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-none"
                  draggable={false}
                />
              </div>
            )}

            {/* Next Arrow */}
            {filteredAndSortedList.length > 1 && (
              <button
                onClick={() => navigatePreview(1)}
                title="Next (Right Arrow)"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition z-30 shadow-xl border border-white/10 cursor-pointer hover:scale-110"
              >
                <FaChevronRight className="text-lg" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Instructions, Mobile Zoom controls & Index Counter */}
          <div
            className="w-full bg-black/60 backdrop-blur-md border-t border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-gray-400 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              {previewItem.type !== "Video" ? (
                <span className="hidden sm:inline text-[11px] text-gray-400">
                  💡 Scroll to zoom • Drag to pan when zoomed • Double-click to toggle 2x zoom
                </span>
              ) : (
                <span className="text-[11px] text-gray-400">
                  💡 Use video player controls to play / pause
                </span>
              )}
            </div>

            {/* Mobile Zoom Controls Bar */}
            {previewItem.type !== "Video" && (
              <div className="flex sm:hidden items-center bg-white/10 rounded-xl px-2 py-1 gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-1 text-white hover:text-purple-400"
                >
                  <FaSearchMinus />
                </button>
                <span className="text-[11px] font-mono text-white font-bold">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 text-white hover:text-purple-400"
                >
                  <FaSearchPlus />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-1 text-white hover:text-purple-400 ml-1"
                >
                  <FaRedo />
                </button>
              </div>
            )}

            {/* Item Counter */}
            <div className="font-mono text-xs font-semibold text-white">
              {filteredAndSortedList.findIndex((it) => it.id === previewItem.id) + 1} /{" "}
              {filteredAndSortedList.length}
            </div>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl mb-4">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Clear Download History?
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              This will remove all downloaded items from your downloads history list. The actual files already downloaded to your device will not be deleted.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-red-200 cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Downloads;