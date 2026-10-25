import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaImage,
  FaVideo,
  FaCheck,
  FaSpinner,
  FaDownload,
  FaHeart,
  FaRegHeart,
  FaLock,
  FaPaperPlane,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getMediaByFilter } from "../../app/media/mediaThunk";
import {
  saveUserSelectedMedia,
  getMySelectedMedia,
  toggleMediaSelection,
  submitUserSelectedMedia,
} from "../../app/slectedmedia/slectedmediaThunk";
import { downloadDirectMedia } from "../../utils/downloadHelper";

export default function AlbumDetails() {
  const [selected, setSelected] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [selectionStatus, setSelectionStatus] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { favoriteMediaIds, toggleLoading } = useSelector(
    (state) => state.slectedmedia
  );

  const album = location.state?.album;
  const initialMedia = location.state?.albumMediaList;

  // Load Album Media & Existing User Selection
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        // 1. Fetch Media List
        if (initialMedia && initialMedia.length > 0) {
          setMediaList(initialMedia);
        } else if (id) {
          const mediaRes = await dispatch(
            getMediaByFilter({ eventId: id, limit: 200 })
          ).unwrap();
          if (isMounted && mediaRes?.success) {
            setMediaList(mediaRes.data || []);
          }
        }

        // 2. Fetch User's Saved Selection for this Event
        if (id) {
          const selectionRes = await dispatch(
            getMySelectedMedia({ eventId: id })
          ).unwrap();
          if (isMounted && selectionRes?.success) {
            const currentEventDoc = (selectionRes.data || []).find(
              (doc) => (doc.eventId?._id || doc.eventId) === id
            );

            if (currentEventDoc) {
              const preselectedIds = (currentEventDoc.selectedMedia || [])
                .map((item) => item.mediaId?._id || item.mediaId)
                .filter(Boolean)
                .map(String);
              setSelected(preselectedIds);
              setSelectionStatus(currentEventDoc.status);
              setIsLocked(Boolean(currentEventDoc.isLocked));
            }
          }
        }
      } catch (err) {
        console.error("Error loading album details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, initialMedia, dispatch]);

  const albumTitle =
    album
      ? [album.brideName, album.groomName].filter(Boolean).join(" & ") ||
        album.eventSubCategoryId?.name ||
        album.location ||
        "Album Event"
      : "Album Details";

  const albumDate = album?.eventDate
    ? new Date(album.eventDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // Toggle Selection (Checkmark)
  const toggleSelect = (mediaId) => {
    if (isLocked) {
      toast.info("This album selection has already been submitted and locked.");
      return;
    }
    const strId = String(mediaId);
    if (selected.includes(strId)) {
      setSelected(selected.filter((item) => item !== strId));
    } else {
      setSelected([...selected, strId]);
    }
  };

  // Toggle Favorite Heart
  const handleToggleFavorite = async (e, mediaId) => {
    e.stopPropagation();
    try {
      const res = await dispatch(
        toggleMediaSelection({ mediaId, eventId: id })
      ).unwrap();
      if (res.success) {
        toast.success(res.message || "Favorite updated");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update favorite");
    }
  };

  // Save Selection Handler
  const handleSaveSelection = async () => {
    if (!id) {
      toast.error("Event ID missing");
      return;
    }
    if (isLocked) {
      toast.warning("Selection is locked and cannot be edited.");
      return;
    }

    try {
      setSaving(true);
      const res = await dispatch(
        saveUserSelectedMedia({
          eventId: id,
          selectedMedia: selected,
        })
      ).unwrap();

      if (res.success) {
        toast.success(`Saved ${selected.length} items to your selection!`);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to save selection");
    } finally {
      setSaving(false);
    }
  };

  // Submit & Lock Selection Handler
  const handleSubmitSelection = async () => {
    if (selected.length === 0) {
      toast.warning("Please select at least 1 item before submitting.");
      return;
    }

    const confirmSubmit = window.confirm(
      "Are you sure you want to finalize and submit this selection? Once submitted, it cannot be modified without admin assistance."
    );
    if (!confirmSubmit) return;

    try {
      setSubmitting(true);
      // First ensure current selection is saved
      await dispatch(
        saveUserSelectedMedia({
          eventId: id,
          selectedMedia: selected,
        })
      ).unwrap();

      // Submit and lock
      const res = await dispatch(
        submitUserSelectedMedia({ eventId: id })
      ).unwrap();

      if (res.success) {
        setIsLocked(true);
        setSelectionStatus("Pending");
        toast.success("Selection submitted and locked successfully!");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to submit selection");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    if (filterType === "Photos" && item.videosOrImageUrlType === "Video")
      return false;
    if (filterType === "Videos" && item.videosOrImageUrlType !== "Video")
      return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        item.videosOrImageUrlType?.toLowerCase().includes(query) ||
        false
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-600 font-semibold hover:underline"
          >
            <FaArrowLeft />
            Back to Albums
          </button>
          <h1 className="text-3xl font-bold mt-3 text-gray-800">{albumTitle}</h1>
          <p className="text-gray-500 mt-1">
            {albumDate} {album?.location ? `• ${album.location}` : ""}
          </p>
        </div>

        {/* Lock / Status Badge */}
        {selectionStatus && (
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl text-sm font-medium text-purple-800">
            {isLocked ? <FaLock className="text-purple-600" /> : null}
            <span>
              Status: <strong className="capitalize">{selectionStatus}</strong>
              {isLocked ? " (Locked)" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search media in album..."
        className="mt-6 border border-gray-200 rounded-xl px-4 py-3 w-full outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
      />

      {/* Filter */}
      <div className="flex gap-3 mt-6 flex-wrap items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilterType("All")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filterType === "All"
                ? "bg-purple-600 text-white shadow"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All ({mediaList.length})
          </button>

          <button
            onClick={() => setFilterType("Photos")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filterType === "Photos"
                ? "bg-purple-600 text-white shadow"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Photos (
            {
              mediaList.filter(
                (m) =>
                  m.videosOrImageUrlType === "Image" || !m.videosOrImageUrlType
              ).length
            }
            )
          </button>

          <button
            onClick={() => setFilterType("Videos")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filterType === "Videos"
                ? "bg-purple-600 text-white shadow"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Videos (
            {mediaList.filter((m) => m.videosOrImageUrlType === "Video").length})
          </button>
        </div>

        {selected.length > 0 && (
          <div className="text-sm font-semibold text-purple-700 bg-purple-100 px-4 py-1.5 rounded-full">
            {selected.length} items selected
          </div>
        )}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-purple-600">
          <FaSpinner className="animate-spin text-4xl mb-3" />
          <p className="text-gray-500 font-medium">Loading album media...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border mt-8 shadow-sm">
          <p className="text-gray-500 font-medium">No media found in this album.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
          {filteredMedia.map((item) => {
            const isSelected = selected.includes(String(item._id));
            const isFav = favoriteMediaIds.includes(String(item._id));

            return (
              <div
                key={item._id}
                onClick={() => toggleSelect(item._id)}
                className={`relative cursor-pointer group rounded-xl overflow-hidden shadow border transition-all duration-200 ${
                  isSelected
                    ? "ring-4 ring-purple-600 scale-[0.99]"
                    : "hover:shadow-lg hover:-translate-y-0.5"
                } bg-black`}
              >
                {/* Media Item */}
                {item.videosOrImageUrlType === "Video" ? (
                  <div className="relative h-60 bg-black flex items-center justify-center">
                    <video
                      src={item.videosOrImageUrl}
                      controls
                      controlsList={
                        item.isDownloadable ? undefined : "nodownload"
                      }
                      disablePictureInPicture={!item.isDownloadable}
                      onContextMenu={(e) =>
                        !item.isDownloadable && e.preventDefault()
                      }
                      className="rounded-xl w-full h-60 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-600/90 text-white rounded-full p-2 text-xs flex items-center gap-1 font-medium pointer-events-none z-10">
                      <FaVideo /> Video
                    </div>
                  </div>
                ) : (
                  <div className="relative h-60">
                    <img
                      src={item.videosOrImageUrl || item.thumbnail}
                      alt="Album Media"
                      onContextMenu={(e) =>
                        !item.isDownloadable && e.preventDefault()
                      }
                      className="rounded-xl w-full h-60 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-purple-600/90 text-white rounded-full p-2 text-xs flex items-center gap-1 font-medium z-10">
                      <FaImage /> Photo
                    </div>
                  </div>
                )}

                {/* Top Right Action Icons */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(e, item._id)}
                    title={isFav ? "Remove Favorite" : "Add Favorite"}
                    className={`p-2 rounded-full backdrop-blur-md shadow-md transition ${
                      isFav
                        ? "bg-red-500 text-white"
                        : "bg-black/60 text-white hover:bg-red-500"
                    }`}
                  >
                    {isFav ? (
                      <FaHeart className="text-sm" />
                    ) : (
                      <FaRegHeart className="text-sm" />
                    )}
                  </button>

                  {/* Download Button */}
                  {item.isDownloadable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadDirectMedia(
                          item.videosOrImageUrl || item.thumbnail,
                          `${albumTitle || "media"}_${item._id?.slice(-4)}`,
                          {
                            mediaId: item._id,
                            title: `${albumTitle || "Album"} - ${item.videosOrImageUrlType === "Video" ? "Video" : "Photo"}`,
                            albumTitle: albumTitle,
                            type: item.videosOrImageUrlType === "Video" ? "Video" : "Image",
                            size: item.size || (item.videosOrImageUrlType === "Video" ? "45 MB" : "3.5 MB"),
                            url: item.videosOrImageUrl || item.thumbnail,
                            thumbnail: item.thumbnail || item.videosOrImageUrl,
                            eventId: id,
                          }
                        );
                        toast.success("Download started & added to Downloads!");
                      }}
                      title="Download"
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition backdrop-blur-sm shadow-md cursor-pointer"
                    >
                      <FaDownload className="text-sm" />
                    </button>
                  )}
                </div>

                {/* Selection Overlay Checkmark */}
                {isSelected && (
                  <div className="absolute inset-0 bg-purple-700/40 rounded-xl flex justify-center items-center z-20 pointer-events-none">
                    <div className="bg-white rounded-full p-3 shadow-lg transform scale-110 animate-fade-in">
                      <FaCheck className="text-purple-600 text-2xl" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-[92%] max-w-4xl bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border border-purple-200 z-40 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
              {selected.length}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 leading-tight">
                {selected.length} {selected.length === 1 ? "Item" : "Items"} Selected
              </h2>
              <p className="text-xs text-gray-500">
                {isLocked ? "Selection is locked" : "Ready to save or submit"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {!isLocked && (
              <button
                type="button"
                onClick={() => setSelected([])}
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              disabled={saving || isLocked}
              onClick={handleSaveSelection}
              className={`flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-md ${
                saving || isLocked ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Selection"
              )}
            </button>

            {!isLocked && (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitSelection}
                className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-md ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" /> Submit & Lock
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}