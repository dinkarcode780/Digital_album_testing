// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, Link } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaDownload,
//   FaTrash,
//   FaImage,
//   FaVideo,
//   FaSearch,
//   FaCompress,
//   FaExpand,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { getMediaById, toggleDownload, toggleMediaActive, deleteMedia, updateMedia } from "../../app/media/mediaThunk";

// const AdminAlbumDetailsPage = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const { media, loading } = useSelector((state) => state.media);

//   const [search, setSearch] = useState("");
//   const [zoomed, setZoomed] = useState(false);
//   const [videoSize, setVideoSize] = useState("medium");
//   const [newMediaFile, setNewMediaFile] = useState(null);
//   const [newThumbnail, setNewThumbnail] = useState(null);
//   const [newDownloadable, setNewDownloadable] = useState(false);
//   const [newActive, setNewActive] = useState(false);

//   useEffect(() => {
//     if (id) {
//       dispatch(getMediaById(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (media) {
//       setNewDownloadable(media.isDownloadable);
//       setNewActive(media.isActive);
//     }
//   }, [media]);

//   const handleToggleDownload = async () => {
//     if (!media?._id) return;
//     await dispatch(toggleDownload(media._id));
//     dispatch(getMediaById(media._id));
//   };

//   const handleToggleActive = async () => {
//     if (!media?._id) return;
//     await dispatch(toggleMediaActive(media._id));
//     dispatch(getMediaById(media._id));
//   };

//   const handleDelete = async () => {
//     if (!media?._id) return;
//     await dispatch(deleteMedia(media._id));
//   };

//   const handleUpdateMedia = async () => {
//     if (!media?._id) return;

//     const formData = new FormData();
//     formData.append("mediaId", media._id);
//     formData.append("isDownloadable", newDownloadable);
//     formData.append("isActive", newActive);

//     if (newMediaFile) {
//       formData.append("mediaFile", newMediaFile);
//     }
//     if (newThumbnail) {
//       formData.append("thumbnail", newThumbnail);
//     }

//     await dispatch(updateMedia(formData));
//     dispatch(getMediaById(media._id));
//   };

//   const eventLabel = (item) => {
//     const event = item?.eventId;
//     if (!event) return "No event";
//     const names = [event.brideName, event.groomName].filter(Boolean).join(" & ");
//     return names || event.location || "Unnamed event";
//   };

//   const objectFitClass =
//     videoSize === "small"
//       ? "h-56"
//       : videoSize === "medium"
//       ? "h-80"
//       : "h-[420px]";

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col lg:flex-row justify-between gap-5">
//         <div>
//           <Link
//             to="/admin/albums"
//             className="text-purple-600 font-semibold flex items-center gap-2 mb-3"
//           >
//             <FaArrowLeft /> Back
//           </Link>
//           <h1 className="text-3xl font-bold">{eventLabel(media)}</h1>
//           <p className="text-gray-500 mt-2">
//             {media?.eventId?.location}
//             {media?.eventId?.eventDate
//               ? ` • ${new Date(media.eventId.eventDate).toLocaleDateString()}`
//               : ""}
//           </p>
//         </div>

//         <div className="relative w-full lg:w-80">
//           <FaSearch className="absolute left-4 top-4 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             type="text"
//             placeholder="Search in media..."
//             className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white shadow rounded-2xl overflow-hidden">
//           <div className="relative bg-black">
//             {media?.videosOrImageUrlType === "Video" ? (
//               <video
//                 src={media.videosOrImageUrl}
//                 controls
//                 className={`w-full object-cover ${objectFitClass}`}
//               />
//             ) : (
//               <img
//                 src={media?.videosOrImageUrl}
//                 alt={eventLabel(media)}
//                 className={`w-full object-contain ${
//                   zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
//                 } ${zoomed ? "h-[720px]" : "h-[420px]"}`}
//                 onClick={() => setZoomed((prev) => !prev)}
//               />
//             )}

//             <div className="absolute top-3 right-3 flex items-center gap-2">
//               {media?.videosOrImageUrlType === "Video" ? (
//                 <button
//                   onClick={() =>
//                     setVideoSize((prev) =>
//                       prev === "small"
//                         ? "medium"
//                         : prev === "medium"
//                         ? "large"
//                         : "small"
//                     )
//                   }
//                   className="bg-white/90 text-gray-700 rounded-full p-2 shadow"
//                   title="Toggle video size"
//                 >
//                   {videoSize === "large" ? <FaCompress /> : <FaExpand />}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => setZoomed((prev) => !prev)}
//                   className="bg-white/90 text-gray-700 rounded-full p-2 shadow"
//                   title={zoomed ? "Zoom out" : "Zoom in"}
//                 >
//                   {zoomed ? <FaCompress /> : <FaExpand />}
//                 </button>
//               )}
//             </div>
//           </div>

//           {loading && (
//             <div className="p-6 text-gray-500">Loading media...</div>
//           )}

//           {!loading && !media && (
//             <div className="p-6 text-center text-gray-500">
//               Media not found.
//             </div>
//           )}
//         </div>

//         <div className="bg-white rounded-2xl shadow p-6 space-y-5">
//           <div className="flex items-center gap-3">
//             <div className="rounded-full bg-purple-100 text-purple-700 p-3">
//               <FaInfoCircle />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Media Type</p>
//               <p className="font-semibold">{media?.videosOrImageUrlType || "N/A"}</p>
//             </div>
//           </div>

//           <div className="space-y-3 text-sm text-gray-600">
//             <div>
//               <p className="text-gray-500">Download Permission</p>
//               <p className="font-semibold">
//                 {media?.isDownloadable ? "Enabled" : "Disabled"}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-500">Event</p>
//               <p className="font-semibold">{eventLabel(media)}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Sub Category</p>
//               <p className="font-semibold">
//                 {media?.eventId?.eventSubCategoryId?.name || "N/A"}
//               </p>
//             </div>

//             <div>
//               <p className="text-gray-500">Category</p>
//               <p className="font-semibold">
//                 {media?.eventId?.eventSubCategoryId?.categoryId?.name || "N/A"}
//               </p>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <label className="block text-sm font-semibold text-gray-700">
//               Update Media File
//             </label>
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={(e) => setNewMediaFile(e.target.files?.[0] || null)}
//               className="w-full border rounded-xl p-3"
//             />

//             <label className="block text-sm font-semibold text-gray-700">
//               Update Thumbnail
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNewThumbnail(e.target.files?.[0] || null)}
//               className="w-full border rounded-xl p-3"
//             />

//             <div className="grid grid-cols-2 gap-3">
//               <label className="flex items-center gap-2 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={newDownloadable}
//                   onChange={(e) => setNewDownloadable(e.target.checked)}
//                 />
//                 Downloadable
//               </label>
//               <label className="flex items-center gap-2 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={newActive}
//                   onChange={(e) => setNewActive(e.target.checked)}
//                 />
//                 Active
//               </label>
//             </div>

//             <button
//               onClick={handleUpdateMedia}
//               className="w-full rounded-xl bg-blue-600 text-white py-3 hover:bg-blue-700 transition"
//             >
//               Save Updates
//             </button>
//             <button
//               onClick={handleToggleDownload}
//               className="w-full rounded-xl bg-purple-600 text-white py-3 hover:bg-purple-700 transition"
//             >
//               {media?.isDownloadable ? "Disable Download" : "Enable Download"}
//             </button>
//             <button
//               onClick={handleToggleActive}
//               className={`w-full rounded-xl py-3 transition ${
//                 media?.isActive
//                   ? "bg-orange-500 text-white hover:bg-orange-600"
//                   : "bg-green-600 text-white hover:bg-green-700"
//               }`}
//             >
//               {media?.isActive ? "Deactivate Media" : "Activate Media"}
//             </button>
//             <button
//               onClick={handleDelete}
//               className="w-full rounded-xl bg-red-600 text-white py-3 hover:bg-red-700 transition"
//             >
//               Delete Media
//             </button>
//             <a
//               href={media?.videosOrImageUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-gray-200 text-gray-700 py-3 hover:bg-gray-50 transition"
//             >
//               <FaDownload /> Open in new tab
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAlbumDetailsPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import {
  FaArrowLeft,
  FaDownload,
  FaTrash,
  FaImage,
  FaVideo,
  FaSearch,
  FaCompress,
  FaExpand,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaUndo,
  FaRedo,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPowerOff,
  FaSave,
  FaCloudUploadAlt,
} from "react-icons/fa";

import {
  getMediaById,
  toggleDownload,
  toggleMediaActive,
  deleteMedia,
  updateMedia,
} from "../../app/media/mediaThunk";

const AdminAlbumDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { media, loading } = useSelector(
    (state) => state.media
  );

  const [search, setSearch] = useState("");

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [videoSize, setVideoSize] = useState("medium");

  const [newMediaFile, setNewMediaFile] =
    useState(null);

  const [newThumbnail, setNewThumbnail] =
    useState(null);

  const [newDownloadable, setNewDownloadable] =
    useState(false);

  const [newActive, setNewActive] =
    useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getMediaById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (media) {
      setNewDownloadable(
        Boolean(media.isDownloadable)
      );

      setNewActive(
        Boolean(media.isActive)
      );
    }
  }, [media]);

  const handleToggleDownload = async () => {
    if (!media?._id) return;

    await dispatch(
      toggleDownload(media._id)
    );

    dispatch(
      getMediaById(media._id)
    );
  };

  const handleToggleActive = async () => {
    if (!media?._id) return;

    await dispatch(
      toggleMediaActive(media._id)
    );

    dispatch(
      getMediaById(media._id)
    );
  };

  const handleDelete = async () => {
    if (!media?._id) return;

    await dispatch(
      deleteMedia(media._id)
    );
  };

  const handleUpdateMedia = async () => {
    if (!media?._id) return;

    const formData = new FormData();

    formData.append(
      "mediaId",
      media._id
    );

    formData.append(
      "isDownloadable",
      newDownloadable
    );

    formData.append(
      "isActive",
      newActive
    );

    if (newMediaFile) {
      formData.append(
        "mediaFile",
        newMediaFile
      );
    }

    if (newThumbnail) {
      formData.append(
        "thumbnail",
        newThumbnail
      );
    }

    await dispatch(
      updateMedia(formData)
    );

    dispatch(
      getMediaById(media._id)
    );
  };

  const eventLabel = (item) => {
    const event = item?.eventId;

    if (!event) {
      return "No event";
    }

    const names = [
      event.brideName,
      event.groomName,
    ]
      .filter(Boolean)
      .join(" & ");

    return (
      names ||
      event.location ||
      "Unnamed event"
    );
  };

  const resetImageView = () => {
    setZoom(1);
    setRotation(0);
  };

  const zoomIn = () => {
    setZoom((prev) =>
      Math.min(prev + 0.25, 3)
    );
  };

  const zoomOut = () => {
    setZoom((prev) =>
      Math.max(prev - 0.25, 0.5)
    );
  };

  const rotateLeft = () => {
    setRotation(
      (prev) => prev - 90
    );
  };

  const rotateRight = () => {
    setRotation(
      (prev) => prev + 90
    );
  };

  const toggleVideoSize = () => {
    setVideoSize((prev) =>
      prev === "small"
        ? "medium"
        : prev === "medium"
        ? "large"
        : "small"
    );
  };

  const videoHeight =
    videoSize === "small"
      ? "h-56"
      : videoSize === "medium"
      ? "h-80"
      : "h-[520px]";

  return (
    <div className="detail-page relative space-y-8 pb-8">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div
          className="
            detail-glow
            absolute
            -left-40
            top-20
            h-96
            w-96
            rounded-full
            bg-purple-300/20
            blur-3xl
          "
        />

        <div
          className="
            detail-glow
            absolute
            right-0
            top-72
            h-80
            w-80
            rounded-full
            bg-indigo-300/20
            blur-3xl
          "
        />

      </div>


      {/* =================================================
          HEADER
      ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[30px]
          bg-gradient-to-br
          from-[#4c1d95]
          via-[#6d28d9]
          to-[#7c3aed]
          p-6
          text-white
          shadow-[0_20px_60px_rgba(109,40,217,0.22)]
          sm:p-8
        "
      >

        <div
          className="
            absolute
            -right-20
            -top-24
            h-72
            w-72
            rounded-full
            border-[30px]
            border-white/10
          "
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <Link
              to="/admin/albums"
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/15
                bg-white/10
                px-4
                py-2
                text-sm
                font-semibold
                backdrop-blur-md
                transition
                hover:bg-white/20
              "
            >
              <FaArrowLeft />

              Back to Media Library
            </Link>


            <h1
              className="
                text-3xl
                font-extrabold
                tracking-tight
                sm:text-4xl
              "
            >
              {eventLabel(media)}
            </h1>


            <p className="mt-3 text-sm text-purple-100 sm:text-base">

              {media?.eventId?.location ||
                "Media Details"}

              {media?.eventId?.eventDate
                ? ` • ${new Date(
                    media.eventId.eventDate
                  ).toLocaleDateString()}`
                : ""}

            </p>

          </div>


          <div
            className="
              hidden
              h-24
              w-24
              items-center
              justify-center
              rounded-3xl
              border
              border-white/20
              bg-white/10
              text-5xl
              backdrop-blur-md
              lg:flex
            "
          >
            {media?.videosOrImageUrlType ===
            "Video"
              ? "🎥"
              : "📸"}
          </div>

        </div>

      </section>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <p className="text-sm font-semibold text-purple-600">
            Media Preview
          </p>

          <h2 className="text-2xl font-extrabold text-gray-800">
            View & Manage Media
          </h2>

        </div>


        <div className="relative w-full sm:w-80">

          <FaSearch
            className="
              absolute
              left-4
              top-4
              text-gray-400
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            type="text"
            placeholder="Search in media..."
            className="
              detail-input
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              py-3
              pl-11
              pr-4
              shadow-sm
            "
          />

        </div>

      </div>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid gap-7 lg:grid-cols-3">

        {/* =================================================
            MEDIA PREVIEW
        ================================================= */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-100
            bg-white
            shadow-sm
            lg:col-span-2
          "
        >

          <div className="detail-preview relative">

            {/* Loading */}

            {loading && (

              <div
                className="
                  flex
                  h-[420px]
                  items-center
                  justify-center
                  text-gray-300
                "
              >

                <div className="text-center">

                  <div
                    className="
                      mx-auto
                      mb-4
                      h-12
                      w-12
                      animate-spin
                      rounded-full
                      border-4
                      border-purple-200
                      border-t-purple-600
                    "
                  />

                  <p className="text-sm">
                    Loading media...
                  </p>

                </div>

              </div>

            )}


            {/* Not Found */}

            {!loading && !media && (

              <div
                className="
                  flex
                  h-[420px]
                  items-center
                  justify-center
                  text-center
                  text-gray-400
                "
              >
                Media not found.
              </div>

            )}


            {/* IMAGE */}

            {!loading &&
              media &&
              media.videosOrImageUrlType ===
                "Image" && (

                <div
                  className="
                    flex
                    min-h-[420px]
                    items-center
                    justify-center
                    overflow-hidden
                    p-4
                    sm:p-8
                  "
                >

                  <img
                    src={
                      media.videosOrImageUrl
                    }
                    alt={eventLabel(media)}
                    className="
                      detail-image
                      max-h-[650px]
                      max-w-full
                      select-none
                      object-contain
                    "
                    style={{
                      transform: `
                        scale(${zoom})
                        rotate(${rotation}deg)
                      `,
                    }}
                    draggable={false}
                  />

                </div>

              )}


            {/* VIDEO */}

            {!loading &&
              media &&
              media.videosOrImageUrlType ===
                "Video" && (

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    p-4
                    sm:p-8
                  "
                >

                  <video
                    src={
                      media.videosOrImageUrl
                    }
                    controls
                    className={`
                      w-full
                      object-contain
                      transition-all
                      duration-500
                      ${videoHeight}
                    `}
                  />

                </div>

              )}


            {/* =================================================
                MEDIA CONTROLS
            ================================================= */}

            {media &&
              !loading && (

                <div
                  className="
                    absolute
                    bottom-4
                    left-1/2
                    z-20
                    flex
                    -translate-x-1/2
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-white/20
                    bg-black/60
                    p-2
                    shadow-2xl
                    backdrop-blur-xl
                  "
                >

                  {media.videosOrImageUrlType ===
                  "Image" ? (
                    <>

                      {/* Zoom Out */}

                      <button
                        type="button"
                        onClick={zoomOut}
                        disabled={zoom <= 0.5}
                        className="
                          detail-control
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          text-white
                          hover:bg-white/15
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                        title="Zoom Out"
                      >
                        <FaMinus />
                      </button>


                      {/* Zoom Value */}

                      <span
                        className="
                          min-w-[58px]
                          text-center
                          text-xs
                          font-bold
                          text-white
                        "
                      >
                        {Math.round(
                          zoom * 100
                        )}
                        %
                      </span>


                      {/* Zoom In */}

                      <button
                        type="button"
                        onClick={zoomIn}
                        disabled={zoom >= 3}
                        className="
                          detail-control
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          text-white
                          hover:bg-white/15
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                        title="Zoom In"
                      >
                        <FaPlus />
                      </button>


                      <div className="mx-1 h-7 w-px bg-white/20" />


                      {/* Rotate Left */}

                      <button
                        type="button"
                        onClick={rotateLeft}
                        className="
                          detail-control
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          text-white
                          hover:bg-white/15
                        "
                        title="Rotate Left"
                      >
                        <FaUndo />
                      </button>


                      {/* Rotate Right */}

                      <button
                        type="button"
                        onClick={rotateRight}
                        className="
                          detail-control
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          text-white
                          hover:bg-white/15
                        "
                        title="Rotate Right"
                      >
                        <FaRedo />
                      </button>


                      {/* Reset */}

                      <button
                        type="button"
                        onClick={resetImageView}
                        className="
                          detail-control
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          text-white
                          hover:bg-white/15
                        "
                        title="Reset View"
                      >
                        <FaSyncAlt />
                      </button>

                    </>
                  ) : (

                    <button
                      type="button"
                      onClick={toggleVideoSize}
                      className="
                        detail-control
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-white/15
                      "
                      title="Change video size"
                    >

                      {videoSize ===
                      "large" ? (
                        <FaCompress />
                      ) : (
                        <FaExpand />
                      )}

                      {videoSize ===
                      "small"
                        ? "Small"
                        : videoSize ===
                          "medium"
                        ? "Medium"
                        : "Large"}

                    </button>

                  )}

                </div>

              )}

          </div>


          {/* Media Type Footer */}

          {media && (

            <div
              className="
                flex
                flex-col
                gap-4
                border-t
                border-gray-100
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      media.videosOrImageUrlType ===
                      "Image"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-red-100 text-red-600"
                    }
                  `}
                >
                  {media.videosOrImageUrlType ===
                  "Image" ? (
                    <FaImage />
                  ) : (
                    <FaVideo />
                  )}
                </div>


                <div>

                  <p className="text-sm font-bold text-gray-800">
                    {media.videosOrImageUrlType}
                  </p>

                  <p className="text-xs text-gray-400">
                    Media preview
                  </p>

                </div>

              </div>


              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  self-start
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  font-bold
                  sm:self-auto
                  ${
                    media.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }
                `}
              >

                {media.isActive ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}

                {media.isActive
                  ? "Active Media"
                  : "Inactive Media"}

              </span>

            </div>

          )}

        </div>


        {/* =================================================
            SIDE PANEL
        ================================================= */}

        <div
          className="
            detail-info-card
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-6
            shadow-sm
          "
        >

          {/* Heading */}

          <div className="mb-6 flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-purple-100
                text-purple-600
              "
            >
              <FaInfoCircle />
            </div>


            <div>

              <h2 className="text-xl font-extrabold text-gray-800">
                Media Information
              </h2>

              <p className="text-xs text-gray-400">
                Details & controls
              </p>

            </div>

          </div>


          {/* Information */}

          <div className="space-y-4">

            <InfoRow
              label="Media Type"
              value={
                media?.videosOrImageUrlType ||
                "N/A"
              }
            />

            <InfoRow
              label="Download Permission"
              value={
                media?.isDownloadable
                  ? "Enabled"
                  : "Disabled"
              }
            />

            <InfoRow
              label="Event"
              value={eventLabel(media)}
            />

            <InfoRow
              label="Sub Category"
              value={
                media?.eventId
                  ?.eventSubCategoryId
                  ?.name || "N/A"
              }
            />

            <InfoRow
              label="Category"
              value={
                media?.eventId
                  ?.eventSubCategoryId
                  ?.categoryId
                  ?.name || "N/A"
              }
            />

          </div>


          {/* Divider */}

          <div className="my-6 border-t border-gray-100" />


          {/* Update Media */}

          <div className="space-y-4">

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Update Media File
              </label>

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-dashed
                  border-purple-200
                  bg-purple-50/50
                  p-3
                  text-sm
                  text-gray-500
                  transition
                  hover:border-purple-400
                  hover:bg-purple-50
                "
              >

                <FaCloudUploadAlt className="text-purple-500" />

                <span className="truncate">
                  {newMediaFile
                    ? newMediaFile.name
                    : "Choose image or video"}
                </span>

                <input
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  onChange={(e) =>
                    setNewMediaFile(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                />

              </label>

            </div>


            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Update Thumbnail
              </label>

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-dashed
                  border-gray-200
                  bg-gray-50
                  p-3
                  text-sm
                  text-gray-500
                  transition
                  hover:border-purple-300
                  hover:bg-purple-50
                "
              >

                <FaImage className="text-purple-500" />

                <span className="truncate">
                  {newThumbnail
                    ? newThumbnail.name
                    : "Choose thumbnail"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setNewThumbnail(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                />

              </label>

            </div>


            {/* Checkboxes */}

            <div className="grid grid-cols-2 gap-3">

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-100
                  bg-gray-50
                  p-3
                  text-xs
                  font-semibold
                  text-gray-600
                  transition
                  hover:bg-purple-50
                "
              >

                <input
                  type="checkbox"
                  checked={newDownloadable}
                  onChange={(e) =>
                    setNewDownloadable(
                      e.target.checked
                    )
                  }
                  className="accent-purple-600"
                />

                Downloadable

              </label>


              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-100
                  bg-gray-50
                  p-3
                  text-xs
                  font-semibold
                  text-gray-600
                  transition
                  hover:bg-purple-50
                "
              >

                <input
                  type="checkbox"
                  checked={newActive}
                  onChange={(e) =>
                    setNewActive(
                      e.target.checked
                    )
                  }
                  className="accent-purple-600"
                />

                Active

              </label>

            </div>


            {/* Save */}

            <button
              type="button"
              onClick={handleUpdateMedia}
              className="
                detail-control
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-blue-100
                hover:bg-blue-700
              "
            >

              <FaSave />

              Save Updates

            </button>


            {/* Download */}

            <button
              type="button"
              onClick={
                handleToggleDownload
              }
              className="
                detail-control
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-purple-600
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-purple-100
                hover:bg-purple-700
              "
            >

              <FaDownload />

              {media?.isDownloadable
                ? "Disable Download"
                : "Enable Download"}

            </button>


            {/* Active */}

            <button
              type="button"
              onClick={
                handleToggleActive
              }
              className={`
                detail-control
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                py-3
                text-sm
                font-bold
                text-white
                ${
                  media?.isActive
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-600 hover:bg-green-700"
                }
              `}
            >

              <FaPowerOff />

              {media?.isActive
                ? "Deactivate Media"
                : "Activate Media"}

            </button>


            {/* Delete */}

            <button
              type="button"
              onClick={handleDelete}
              className="
                detail-control
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-50
                py-3
                text-sm
                font-bold
                text-red-600
                hover:bg-red-600
                hover:text-white
              "
            >

              <FaTrash />

              Delete Media

            </button>


            {/* Open */}

            <a
              href={
                media?.videosOrImageUrl
              }
              target="_blank"
              rel="noreferrer"
              className="
                detail-control
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                py-3
                text-sm
                font-bold
                text-gray-700
                hover:bg-gray-50
              "
            >

              <FaDownload />

              Open in New Tab

            </a>

          </div>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-100
        bg-gray-50/70
        p-3
      "
    >

      <p className="text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-gray-700">
        {value}
      </p>

    </div>
  );
};

export default AdminAlbumDetailsPage;