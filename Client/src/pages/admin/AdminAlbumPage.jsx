// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useSearchParams } from "react-router-dom";
// import {
//   FaSearch,
//   FaImages,
//   FaImage,
//   FaVideo,
//   FaEye,
//   FaDownload,
//   FaCircle,
//   FaArrowRight,
// } from "react-icons/fa";
// import Pagination from "../../components/common/Pagination";
// import {
//   getMediaByFilter,
//   toggleDownload,
//   deleteMedia,
//   toggleMediaActive,
// } from "../../app/media/mediaThunk";
// import { getAllEventByFilter } from "../../app/event/eventThunk";
// import { getEventCategoryByFilter } from "../../app/category/categoryThunk";
// import { getSubCategoryByFilter } from "../../app/subcategory/subcategoryThunk";

// const AdminAlbumPage = () => {
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();
//   const urlEventId = searchParams.get("eventId");
//   const urlUserId = searchParams.get("userId");

//   const { medias = [], pagination = {}, loading } = useSelector(
//     (state) => state.media
//   );
//   const { eventCategories = [] } = useSelector(
//     (state) => state.eventCategory
//   );
//   const { subCategories = [] } = useSelector((state) => state.subCategory);
//   const { events = [] } = useSelector((state) => state.event);

//   const [search, setSearch] = useState("");
//   const [mediaType, setMediaType] = useState("All");
//   const [downloadFilter, setDownloadFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const [subCategoryFilter, setSubCategoryFilter] = useState("All");
//   const [eventFilter, setEventFilter] = useState(urlEventId || "All");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(12);

//   useEffect(() => {
//     if (urlEventId) {
//       setEventFilter(urlEventId);
//     }
//   }, [urlEventId]);

//   useEffect(() => {
//     dispatch(
//       getEventCategoryByFilter({
//         page: 1,
//         limit: 100,
//       })
//     );
//     dispatch(
//       getAllEventByFilter({
//         page: 1,
//         limit: 100,
//       })
//     );
//   }, [dispatch]);

//   useEffect(() => {
//     if (categoryFilter !== "All") {
//       dispatch(
//         getSubCategoryByFilter({
//           categoryId: categoryFilter,
//           page: 1,
//           limit: 100,
//         })
//       );
//     }
//   }, [dispatch, categoryFilter]);

//   const buildFilterParams = () => {
//     const params = { page, limit };

//     if (search.trim()) params.search = search.trim();
//     if (mediaType !== "All") params.mediaType = mediaType;
//     if (downloadFilter !== "All") {
//       params.isDownloadable = downloadFilter === "Enabled" ? "true" : "false";
//     }

//     if (statusFilter !== "All") {
//       params.isActive = statusFilter === "Active" ? "true" : "false";
//     }

//     if (eventFilter !== "All") {
//       params.eventId = eventFilter;
//     } else if (urlUserId) {
//       params.userId = urlUserId;
//     } else if (subCategoryFilter !== "All") {
//       params.eventSubCategoryId = subCategoryFilter;
//     } else if (categoryFilter !== "All") {
//       params.categoryId = categoryFilter;
//     }

//     return params;
//   };

//   useEffect(() => {
//     dispatch(getMediaByFilter(buildFilterParams()));
//   }, [dispatch, search, mediaType, downloadFilter, statusFilter, page, limit, categoryFilter, subCategoryFilter, eventFilter]);

//   const handleToggleDownload = async (mediaId) => {
//     await dispatch(toggleDownload(mediaId));
//     dispatch(getMediaByFilter(buildFilterParams()));
//   };

//   const handleToggleActive = async (mediaId) => {
//     await dispatch(toggleMediaActive(mediaId));
//     dispatch(getMediaByFilter(buildFilterParams()));
//   };

//   const handleDeleteMedia = async (mediaId) => {
//     await dispatch(deleteMedia(mediaId));
//     dispatch(getMediaByFilter(buildFilterParams()));
//   };

//   const eventLabel = (item) => {
//     const event = item.eventId;
//     if (!event) return "No event";
//     const names = [event.brideName, event.groomName].filter(Boolean).join(" & ");
//     return names || event.location || "Unnamed event";
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row justify-between gap-5">
//         <div>
//           <h1 className="text-3xl font-bold">Media Library</h1>
//           <p className="text-gray-500 mt-2">
//             Manage all uploaded media with search, filters, and pagination.
//           </p>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl shadow p-6">
//         <div className="grid gap-4 lg:grid-cols-4">
//           <div className="lg:col-span-2 relative">
//             <FaSearch className="absolute left-4 top-4 text-gray-400" />
//             <input
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               type="text"
//               placeholder="Search media..."
//               className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Category</label>
//             <select
//               value={categoryFilter}
//               onChange={(e) => {
//                 setCategoryFilter(e.target.value);
//                 setSubCategoryFilter("All");
//                 setEventFilter("All");
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl p-3 mt-2"
//             >
//               <option value="All">All Categories</option>
//               {eventCategories.map((category) => (
//                 <option key={category._id} value={category._id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold">Sub Category</label>
//             <select
//               value={subCategoryFilter}
//               onChange={(e) => {
//                 setSubCategoryFilter(e.target.value);
//                 setEventFilter("All");
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl p-3 mt-2"
//             >
//               <option value="All">All Sub Categories</option>
//               {subCategories
//                 .filter((item) =>
//                   categoryFilter === "All"
//                     ? true
//                     : item.categoryId?._id === categoryFilter,
//                 )
//                 .map((subCategory) => (
//                   <option key={subCategory._id} value={subCategory._id}>
//                     {subCategory.name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold">Event</label>
//             <select
//               value={eventFilter}
//               onChange={(e) => {
//                 setEventFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl p-3 mt-2"
//             >
//               <option value="All">All Events</option>
//               {events
//                 .filter((item) => {
//                   if (categoryFilter !== "All" && item.eventSubCategoryId?.categoryId?._id !== categoryFilter) {
//                     return false;
//                   }
//                   if (subCategoryFilter !== "All" && item.eventSubCategoryId?._id !== subCategoryFilter) {
//                     return false;
//                   }
//                   return true;
//                 })
//                 .map((event) => {
//                   const label = event.brideName || event.groomName
//                     ? `${event.brideName || ""} ${event.groomName || ""}`.trim()
//                     : event.location || "Unnamed event";

//                   return (
//                     <option key={event._id} value={event._id}>
//                       {label}
//                     </option>
//                   );
//                 })}
//             </select>
//           </div>
//         </div>

//         <div className="grid gap-4 lg:grid-cols-4 mt-4">
//           <div>
//             <label className="font-semibold">Media Type</label>
//             <select
//               value={mediaType}
//               onChange={(e) => {
//                 setMediaType(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl p-3 mt-2"
//             >
//               <option value="All">All</option>
//               <option value="Image">Images</option>
//               <option value="Video">Videos</option>
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold">Download Permission</label>
//             <select
//               value={downloadFilter}
//               onChange={(e) => {
//                 setDownloadFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl p-3 mt-2"
//             >
//               <option value="All">All</option>
//               <option value="Enabled">Enabled</option>
//               <option value="Disabled">Disabled</option>
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold">Status</label>
//             <select
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl p-3 mt-2"
//             >
//               <option value="All">All</option>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold">Page Size</label>
//             <select
//               value={limit}
//               onChange={(e) => {
//                 setLimit(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl p-3 mt-2"
//             >
//               <option value={6}>6</option>
//               <option value={12}>12</option>
//               <option value={24}>24</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {loading ? (
//           <div className="col-span-full rounded-2xl bg-white p-10 text-center text-gray-500 shadow">
//             Loading media...
//           </div>
//         ) : medias.length === 0 ? (
//           <div className="col-span-full rounded-2xl bg-white p-10 text-center text-gray-500 shadow">
//             No media found.
//           </div>
//         ) : (
//           medias.map((item) => (
//             <div
//               key={item._id}
//               className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
//             >
//               <div className="relative">
//                 {item.videosOrImageUrlType === "Video" ? (
//                   <video
//                     src={item.videosOrImageUrl}
//                     controls
//                     className="w-full h-56 object-cover bg-black"
//                   />
//                 ) : (
//                   <img
//                     src={item.videosOrImageUrl}
//                     alt={eventLabel(item)}
//                     className="w-full h-56 object-cover"
//                   />
//                 )}

//                 <span className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
//                   <FaCircle
//                     className={
//                       item.videosOrImageUrlType === "Image"
//                         ? "text-green-300"
//                         : "text-red-300"
//                     }
//                   />
//                   {item.videosOrImageUrlType}
//                 </span>
//               </div>

//               <div className="p-4 space-y-3">
//                 <div>
//                   <div className="text-sm text-gray-500">{eventLabel(item)}</div>
//                   <div className="text-base font-semibold">
//                     {item.eventId?.eventSubCategoryId?.name || "No category"}
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2 text-sm text-gray-600">
//                   <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1">
//                     <FaImages />
//                     {item.videosOrImageUrlType}
//                   </span>
//                   <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
//                     <FaDownload />
//                     {item.isDownloadable ? "Download Enabled" : "Download Disabled"}
//                   </span>
//                   <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                     {item.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </div>

//                 <div className="flex flex-col gap-3">
//                   <button
//                     type="button"
//                     onClick={() => handleToggleDownload(item._id)}
//                     className="w-full rounded-xl bg-purple-600 text-white py-3 hover:bg-purple-700 transition"
//                   >
//                     {item.isDownloadable ? "Disable Download" : "Enable Download"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => handleToggleActive(item._id)}
//                     className={`w-full rounded-xl py-3 transition ${
//                       item.isActive
//                         ? "bg-orange-500 text-white hover:bg-orange-600"
//                         : "bg-green-600 text-white hover:bg-green-700"
//                     }`}
//                   >
//                     {item.isActive ? "Deactivate" : "Activate"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => handleDeleteMedia(item._id)}
//                     className="w-full rounded-xl bg-red-600 text-white py-3 hover:bg-red-700 transition"
//                   >
//                     Delete Media
//                   </button>

//                   <Link
//                     to={`/admin/media/${item._id}`}
//                     className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-purple-600 text-purple-600 py-3 hover:bg-purple-50 transition"
//                   >
//                     View Media <FaArrowRight />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <Pagination
//         currentPage={pagination.currentPage || 1}
//         totalPages={pagination.totalPages || 1}
//         onPageChange={(newPage) => setPage(newPage)}
//       />
//     </div>
//   );
// };

// export default AdminAlbumPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

import {
  FaSearch,
  FaImages,
  FaImage,
  FaVideo,
  FaDownload,
  FaCircle,
  FaArrowRight,
  FaFilter,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaPowerOff,
  FaEye,
} from "react-icons/fa";

import Pagination from "../../components/common/Pagination";

import {
  getMediaByFilter,
  toggleDownload,
  deleteMedia,
  toggleMediaActive,
} from "../../app/media/mediaThunk";

import { getAllEventByFilter } from "../../app/event/eventThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";
import { getSubCategoryByFilter } from "../../app/subcategory/subcategoryThunk";

const AdminAlbumPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const urlEventId = searchParams.get("eventId");
  const urlUserId = searchParams.get("userId");

  const {
    medias = [],
    pagination = {},
    loading,
  } = useSelector((state) => state.media);

  const { eventCategories = [] } = useSelector(
    (state) => state.eventCategory
  );

  const { subCategories = [] } = useSelector(
    (state) => state.subCategory
  );

  const { events = [] } = useSelector(
    (state) => state.event
  );

  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState("All");
  const [downloadFilter, setDownloadFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [subCategoryFilter, setSubCategoryFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState(
    urlEventId || "All"
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    if (urlEventId) {
      setEventFilter(urlEventId);
    }
  }, [urlEventId]);

  useEffect(() => {
    dispatch(
      getEventCategoryByFilter({
        page: 1,
        limit: 100,
      })
    );

    dispatch(
      getAllEventByFilter({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (categoryFilter !== "All") {
      dispatch(
        getSubCategoryByFilter({
          categoryId: categoryFilter,
          page: 1,
          limit: 100,
        })
      );
    }
  }, [dispatch, categoryFilter]);

  const buildFilterParams = () => {
    const params = {
      page,
      limit,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (mediaType !== "All") {
      params.mediaType = mediaType;
    }

    if (downloadFilter !== "All") {
      params.isDownloadable =
        downloadFilter === "Enabled"
          ? "true"
          : "false";
    }

    if (statusFilter !== "All") {
      params.isActive =
        statusFilter === "Active"
          ? "true"
          : "false";
    }

    if (eventFilter !== "All") {
      params.eventId = eventFilter;
    } else if (urlUserId) {
      params.userId = urlUserId;
    } else if (subCategoryFilter !== "All") {
      params.eventSubCategoryId = subCategoryFilter;
    } else if (categoryFilter !== "All") {
      params.categoryId = categoryFilter;
    }

    return params;
  };

  useEffect(() => {
    dispatch(
      getMediaByFilter(buildFilterParams())
    );
  }, [
    dispatch,
    search,
    mediaType,
    downloadFilter,
    statusFilter,
    page,
    limit,
    categoryFilter,
    subCategoryFilter,
    eventFilter,
  ]);

  const handleToggleDownload = async (mediaId) => {
    await dispatch(toggleDownload(mediaId));

    dispatch(
      getMediaByFilter(buildFilterParams())
    );
  };

  const handleToggleActive = async (mediaId) => {
    await dispatch(toggleMediaActive(mediaId));

    dispatch(
      getMediaByFilter(buildFilterParams())
    );
  };

  const handleDeleteMedia = async (mediaId) => {
    await dispatch(deleteMedia(mediaId));

    dispatch(
      getMediaByFilter(buildFilterParams())
    );
  };

  const eventLabel = (item) => {
    const event = item.eventId;

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

  const resetFilters = () => {
    setSearch("");
    setMediaType("All");
    setDownloadFilter("All");
    setStatusFilter("All");
    setCategoryFilter("All");
    setSubCategoryFilter("All");
    setEventFilter("All");
    setPage(1);
  };

  return (
    <div className="media-page relative space-y-8 pb-8">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div
          className="
            media-glow
            absolute
            -left-40
            top-24
            h-96
            w-96
            rounded-full
            bg-purple-300/20
            blur-3xl
          "
        />

        <div
          className="
            media-glow
            absolute
            right-0
            top-96
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
          media-shimmer
          relative
          overflow-hidden
          rounded-[30px]
          bg-gradient-to-br
          from-[#4c1d95]
          via-[#6d28d9]
          to-[#7c3aed]
          p-7
          text-white
          shadow-[0_20px_60px_rgba(109,40,217,0.22)]
          sm:p-9
        "
      >

        <div
          className="
            absolute
            -right-24
            -top-28
            h-80
            w-80
            rounded-full
            border-[35px]
            border-white/10
          "
        />

        <div
          className="
            absolute
            -bottom-28
            left-1/3
            h-72
            w-72
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/10
                px-4
                py-2
                text-sm
                font-semibold
                backdrop-blur-md
              "
            >
              <FaImages />

              Digital Media Library
            </div>


            <h1
              className="
                text-3xl
                font-extrabold
                tracking-tight
                sm:text-4xl
              "
            >
              Media Library
            </h1>


            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-purple-100
                sm:text-base
              "
            >
              Manage your studio's photos and videos,
              control downloads, and organize every memory
              from one place.
            </p>


            <div className="mt-6 flex flex-wrap gap-3">

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/15
                  bg-white/10
                  px-4
                  py-3
                  text-sm
                  backdrop-blur-md
                "
              >
                <FaImages />

                <span>
                  {loading
                    ? "Loading..."
                    : `${medias.length} media`}
                </span>
              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/15
                  bg-white/10
                  px-4
                  py-3
                  text-sm
                  backdrop-blur-md
                "
              >
                <FaCloudUploadAlt />

                <span>
                  Media Management
                </span>
              </div>

            </div>

          </div>


          <div
            className="
              media-float
              hidden
              h-32
              w-32
              items-center
              justify-center
              rounded-[32px]
              border
              border-white/20
              bg-white/10
              text-6xl
              shadow-2xl
              backdrop-blur-md
              lg:flex
            "
          >
            📸
          </div>

        </div>

      </section>


      {/* =================================================
          FILTER PANEL
      ================================================= */}

      <section
        className="
          rounded-3xl
          border
          border-gray-100
          bg-white/90
          p-5
          shadow-sm
          backdrop-blur-xl
          sm:p-6
        "
      >

        <div
          className="
            mb-5
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-purple-100
                text-purple-600
              "
            >
              <FaFilter />
            </div>

            <div>

              <h2 className="font-extrabold text-gray-800">
                Search & Filters
              </h2>

              <p className="text-xs text-gray-400">
                Find exactly what you need
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={resetFilters}
            className="
              self-start
              rounded-xl
              border
              border-gray-200
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-600
              transition
              hover:border-purple-200
              hover:bg-purple-50
              hover:text-purple-600
            "
          >
            Reset Filters
          </button>

        </div>


        {/* Search */}

        <div className="relative mb-5">

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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder="Search media, event, client..."
            className="
              media-filter
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50/70
              py-3.5
              pl-11
              pr-4
              outline-none
            "
          />

        </div>


        {/* First Row */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <FilterSelect
            label="Category"
            value={categoryFilter}
            onChange={(value) => {
              setCategoryFilter(value);
              setSubCategoryFilter("All");
              setEventFilter("All");
              setPage(1);
            }}
          >
            <option value="All">
              All Categories
            </option>

            {eventCategories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </FilterSelect>


          <FilterSelect
            label="Sub Category"
            value={subCategoryFilter}
            onChange={(value) => {
              setSubCategoryFilter(value);
              setEventFilter("All");
              setPage(1);
            }}
          >
            <option value="All">
              All Sub Categories
            </option>

            {subCategories
              .filter((item) =>
                categoryFilter === "All"
                  ? true
                  : item.categoryId?._id ===
                    categoryFilter
              )
              .map((subCategory) => (
                <option
                  key={subCategory._id}
                  value={subCategory._id}
                >
                  {subCategory.name}
                </option>
              ))}
          </FilterSelect>


          <FilterSelect
            label="Event"
            value={eventFilter}
            onChange={(value) => {
              setEventFilter(value);
              setPage(1);
            }}
          >
            <option value="All">
              All Events
            </option>

            {events
              .filter((item) => {

                if (
                  categoryFilter !== "All" &&
                  item.eventSubCategoryId
                    ?.categoryId?._id !==
                    categoryFilter
                ) {
                  return false;
                }

                if (
                  subCategoryFilter !== "All" &&
                  item.eventSubCategoryId?._id !==
                    subCategoryFilter
                ) {
                  return false;
                }

                return true;
              })
              .map((event) => {

                const label =
                  event.brideName ||
                  event.groomName
                    ? `${event.brideName || ""} ${
                        event.groomName || ""
                      }`.trim()
                    : event.location ||
                      "Unnamed event";

                return (
                  <option
                    key={event._id}
                    value={event._id}
                  >
                    {label}
                  </option>
                );
              })}
          </FilterSelect>


          <FilterSelect
            label="Media Type"
            value={mediaType}
            onChange={(value) => {
              setMediaType(value);
              setPage(1);
            }}
          >
            <option value="All">
              All Media
            </option>

            <option value="Image">
              Images
            </option>

            <option value="Video">
              Videos
            </option>
          </FilterSelect>

        </div>


        {/* Second Row */}

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <FilterSelect
            label="Download Permission"
            value={downloadFilter}
            onChange={(value) => {
              setDownloadFilter(value);
              setPage(1);
            }}
          >
            <option value="All">
              All
            </option>

            <option value="Enabled">
              Download Enabled
            </option>

            <option value="Disabled">
              Download Disabled
            </option>
          </FilterSelect>


          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </FilterSelect>


          <FilterSelect
            label="Page Size"
            value={limit}
            onChange={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
          >
            <option value={6}>
              6 per page
            </option>

            <option value={12}>
              12 per page
            </option>

            <option value={24}>
              24 per page
            </option>
          </FilterSelect>

        </div>

      </section>


      {/* =================================================
          MEDIA GRID
      ================================================= */}

      <section>

        {loading ? (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (

                <div
                  key={item}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                  "
                >

                  <div
                    className="
                      h-56
                      animate-pulse
                      bg-gray-200
                    "
                  />

                  <div className="space-y-3 p-4">

                    <div className="h-4 animate-pulse rounded bg-gray-200" />

                    <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />

                    <div className="h-10 animate-pulse rounded-xl bg-gray-100" />

                  </div>

                </div>

              )
            )}

          </div>

        ) : medias.length === 0 ? (

          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-purple-200
              bg-white
              px-6
              py-20
              text-center
              shadow-sm
            "
          >

            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                bg-purple-50
                text-4xl
                text-purple-400
              "
            >
              <FaImages />
            </div>


            <h3 className="mt-5 text-xl font-extrabold text-gray-800">
              No Media Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
              No photos or videos match your current
              search and filter settings.
            </p>


            <button
              type="button"
              onClick={resetFilters}
              className="
                mt-6
                rounded-xl
                bg-purple-600
                px-6
                py-3
                font-bold
                text-white
                shadow-lg
                shadow-purple-200
                transition
                hover:bg-purple-700
              "
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >

            {medias.map((item, index) => (

              <div
                key={item._id}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
                className="
                  media-card
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                "
              >

                {/* =============================
                    MEDIA PREVIEW
                ============================= */}

                <div className="group relative h-56 overflow-hidden bg-gray-950">

                  {item.videosOrImageUrlType ===
                  "Video" ? (

                    <video
                      src={item.videosOrImageUrl}
                      controls
                      className="
                        media-image
                        h-full
                        w-full
                        object-cover
                      "
                    />

                  ) : (

                    <img
                      src={item.videosOrImageUrl}
                      alt={eventLabel(item)}
                      className="
                        media-image
                        h-full
                        w-full
                        object-cover
                      "
                    />

                  )}


                  {/* Dark gradient */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/60
                      via-transparent
                      to-black/20
                    "
                  />


                  {/* Media Type */}

                  <span
                    className="
                      absolute
                      left-3
                      top-3
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/20
                      bg-black/60
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-white
                      backdrop-blur-md
                    "
                  >

                    {item.videosOrImageUrlType ===
                    "Image" ? (
                      <FaImage className="text-green-300" />
                    ) : (
                      <FaVideo className="text-red-300" />
                    )}

                    {item.videosOrImageUrlType}

                  </span>


                  {/* Active status */}

                  <span
                    className={`
                      absolute
                      right-3
                      top-3
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      backdrop-blur-md
                      ${
                        item.isActive
                          ? "bg-green-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }
                    `}
                  >

                    {item.isActive ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}

                    {item.isActive
                      ? "Active"
                      : "Inactive"}

                  </span>


                  {/* Hover View */}

                  <Link
                    to={`/admin/media/${item._id}`}
                    className="
                      media-overlay
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-black/20
                    "
                  >

                    <span
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-purple-700
                        shadow-xl
                      "
                    >
                      <FaEye />

                      View Media
                    </span>

                  </Link>

                </div>


                {/* =============================
                    DETAILS
                ============================= */}

                <div className="space-y-4 p-4">

                  <div>

                    <p
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-gray-800
                      "
                    >
                      {eventLabel(item)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {item.eventId
                        ?.eventSubCategoryId
                        ?.name ||
                        "No category"}
                    </p>

                  </div>


                  {/* Badges */}

                  <div className="flex flex-wrap gap-2">

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-purple-50
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-purple-600
                      "
                    >
                      <FaImages />

                      {item.videosOrImageUrlType}
                    </span>


                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${
                          item.isDownloadable
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      <FaDownload />

                      {item.isDownloadable
                        ? "Download On"
                        : "Download Off"}
                    </span>

                  </div>


                  {/* Download */}

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleDownload(
                        item._id
                      )
                    }
                    className="
                      media-action
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

                    {item.isDownloadable
                      ? "Disable Download"
                      : "Enable Download"}

                  </button>


                  {/* Active */}

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleActive(
                        item._id
                      )
                    }
                    className={`
                      media-action
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
                        item.isActive
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    `}
                  >

                    <FaPowerOff />

                    {item.isActive
                      ? "Deactivate"
                      : "Activate"}

                  </button>


                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteMedia(
                        item._id
                      )
                    }
                    className="
                      media-action
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


                  {/* View */}

                  <Link
                    to={`/admin/media/${item._id}`}
                    className="
                      media-action
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-purple-200
                      bg-purple-50
                      py-3
                      text-sm
                      font-bold
                      text-purple-600
                      hover:bg-purple-600
                      hover:text-white
                    "
                  >

                    <FaEye />

                    View Details

                    <FaArrowRight className="text-xs" />

                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =================================================
          PAGINATION
      ================================================= */}

      <div className="flex justify-center">

        <Pagination
          currentPage={
            pagination.currentPage || 1
          }
          totalPages={
            pagination.totalPages || 1
          }
          onPageChange={(newPage) =>
            setPage(newPage)
          }
        />

      </div>

    </div>
  );
};


/* =========================================================
   FILTER SELECT COMPONENT
========================================================= */

const FilterSelect = ({
  label,
  value,
  onChange,
  children,
}) => {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          media-filter
          w-full
          rounded-xl
          border
          border-gray-200
          bg-gray-50/70
          px-4
          py-3
          text-sm
          font-medium
          text-gray-700
          outline-none
        "
      >
        {children}
      </select>

    </div>
  );
};

export default AdminAlbumPage;