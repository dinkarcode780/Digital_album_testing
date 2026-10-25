// import React, { useEffect, useState, useRef } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   FaArrowLeft,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaImages,
//   FaCalendarCheck,
//   FaHeart,
//   FaDownload,
//   FaEdit,
//   FaVideo,
//   FaImage,
//   FaEye,
// } from "react-icons/fa";
// import EditUserDialog from "../../components/admindilog/EditUserDialog";
// import { getUserById, userUpdateProfile } from "../../app/auth/authThunk";
// import { getAllEventByFilter } from "../../app/event/eventThunk";
// import { getMediaByFilter } from "../../app/media/mediaThunk";

// const staticAlbums = [
//   {
//     id: 1,
//     title: "Rahul & Priya Wedding",
//     image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
//     date: "25 May 2026",
//   },
//   {
//     id: 2,
//     title: "Engagement Ceremony",
//     image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
//     date: "12 June 2026",
//   },
//   {
//     id: 3,
//     title: "Birthday Celebration",
//     image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600",
//     date: "18 July 2026",
//   },
// ];

// const bookings = [
//   {
//     id: "BK1001",
//     event: "Wedding",
//     date: "25 Dec 2026",
//     status: "Confirmed",
//   },
//   {
//     id: "BK1002",
//     event: "Reception",
//     date: "28 Dec 2026",
//     status: "Pending",
//   },
// ];

// const UserDetailsPage = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const [userData, setUserData] = useState(null);
//   const [userAlbums, setUserAlbums] = useState([]);
//   const [userMedia, setUserMedia] = useState([]);
//   const [loadingUser, setLoadingUser] = useState(true);
//   const [loadingAlbums, setLoadingAlbums] = useState(true);
//   const [openEdit, setOpenEdit] = useState(false);

//   const albumsRef = useRef(null);

//   const fetchUserDetails = async () => {
//     if (!id) return;
//     setLoadingUser(true);
//     try {
//       const res = await dispatch(getUserById(id)).unwrap();
//       if (res?.success) {
//         setUserData(res.data);
//       }
//     } catch (err) {
//       toast.error(err?.message || "Failed to fetch user details");
//     } finally {
//       setLoadingUser(false);
//     }
//   };

//   const fetchUserAlbums = async () => {
//     if (!id) return;
//     setLoadingAlbums(true);
//     try {
//       const [eventsRes, mediaRes] = await Promise.all([
//         dispatch(getAllEventByFilter({ userId: id, limit: 100 })).unwrap(),
//         dispatch(getMediaByFilter({ userId: id, limit: 100 })).unwrap(),
//       ]);

//       if (eventsRes?.success) {
//         setUserAlbums(eventsRes.data || []);
//       }
//       if (mediaRes?.success) {
//         setUserMedia(mediaRes.data || []);
//       }
//     } catch (err) {
//       console.error("Failed to fetch user albums/media:", err);
//     } finally {
//       setLoadingAlbums(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//     fetchUserAlbums();
//   }, [id]);

//   const handleUpdate = async (updatedUser) => {
//     const result = await dispatch(
//       userUpdateProfile({
//         userId: id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phoneNumber: updatedUser.phoneNumber,
//         address: updatedUser.address,
//         profileImage: updatedUser.profileImage,
//       })
//     );

//     if (userUpdateProfile.fulfilled.match(result)) {
//       toast.success("User updated successfully");
//       setOpenEdit(false);
//       fetchUserDetails();
//     } else {
//       toast.error(result.payload?.message || "Failed to update user");
//     }
//   };

//   const scrollToAlbums = () => {
//     if (albumsRef.current) {
//       albumsRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const formattedJoinedDate = userData?.createdAt
//     ? new Date(userData.createdAt).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "15 Jan 2026";

//   return (
//     <div className="space-y-8">
//       {/* Edit User Dialog */}
//       <EditUserDialog
//         open={openEdit}
//         user={userData}
//         onClose={() => setOpenEdit(false)}
//         onSave={handleUpdate}
//       />

//       {/* Back */}
//       <Link
//         to="/admin/users"
//         className="inline-flex items-center gap-2 text-purple-600 font-semibold"
//       >
//         <FaArrowLeft />
//         Back to Users
//       </Link>

//       {/* Profile */}
//       <div className="bg-white rounded-2xl shadow p-8">
//         {loadingUser ? (
//           <div className="text-center py-10 text-gray-500">
//             Loading user profile...
//           </div>
//         ) : (
//           <div className="flex flex-col lg:flex-row gap-8">
//             <img
//               src={
//                 userData?.profileImage ||
//                 "https://i.pravatar.cc/200?img=11"
//               }
//               alt={userData?.name || "User Avatar"}
//               className="w-40 h-40 rounded-full object-cover border-4 border-purple-500"
//             />

//             <div className="flex-1">
//               <div className="flex justify-between items-start flex-wrap gap-4">
//                 <div>
//                   <h1 className="text-4xl font-bold">
//                     {userData?.name || "Dinkar Paswan"}
//                   </h1>

//                   <p className="text-gray-500 mt-2">
//                     {userData?.userType || "Registered User"}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => setOpenEdit(true)}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition"
//                 >
//                   <FaEdit />
//                   Edit User
//                 </button>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6 mt-8">
//                 <div className="flex items-center gap-3">
//                   <FaEnvelope className="text-purple-600" />
//                   {userData?.email || "dinkar@gmail.com"}
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <FaPhone className="text-green-600" />
//                   {userData?.phoneNumber || "+91 9876543210"}
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <FaMapMarkerAlt className="text-red-500" />
//                   {userData?.address || "Begusarai, Bihar"}
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <FaCalendarAlt className="text-blue-600" />
//                   Joined : {formattedJoinedDate}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//         <div
//           onClick={scrollToAlbums}
//           className="bg-white rounded-2xl shadow p-6 text-center cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
//         >
//           <FaImages className="text-4xl text-purple-600 mx-auto" />

//           <h2 className="text-3xl font-bold mt-3">
//             {userAlbums.length}
//           </h2>

//           <p className="text-gray-600 text-sm mt-1">Total Albums</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <FaCalendarCheck className="text-4xl text-green-600 mx-auto" />

//           <h2 className="text-3xl font-bold mt-3">5</h2>

//           <p className="text-gray-600 text-sm mt-1">Total Bookings</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <FaHeart className="text-4xl text-pink-600 mx-auto" />

//           <h2 className="text-3xl font-bold mt-3">124</h2>

//           <p className="text-gray-600 text-sm mt-1">Favorites</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow p-6 text-center">
//           <FaDownload className="text-4xl text-orange-500 mx-auto" />

//           <h2 className="text-3xl font-bold mt-3">
//             {userMedia.length}
//           </h2>

//           <p className="text-gray-600 text-sm mt-1">Total Media</p>
//         </div>
//       </div>

//       {/* Albums */}
//       <div ref={albumsRef} id="user-albums-section" className="bg-white rounded-2xl shadow p-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold">User Albums</h2>

//           <Link
//             to={`/admin/albums?userId=${id}`}
//             className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
//           >
//             View All
//           </Link>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           {loadingAlbums ? (
//             <div className="col-span-full text-center py-10 text-gray-500">
//               Loading user albums...
//             </div>
//           ) : userAlbums.length > 0 ? (
//             userAlbums.map((album) => {
//               const albumTitle =
//                 [album.brideName, album.groomName].filter(Boolean).join(" & ") ||
//                 album.eventSubCategoryId?.name ||
//                 album.location ||
//                 "Album Event";

//               const albumDate = album.eventDate
//                 ? new Date(album.eventDate).toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                   })
//                 : "Date N/A";

//               const albumMediaList = userMedia.filter(
//                 (m) => String(m.eventId?._id || m.eventId) === String(album._id)
//               );

//               const firstMedia = albumMediaList[0];

//               return (
//                 <div
//                   key={album._id}
//                   className="rounded-xl overflow-hidden border hover:shadow-lg transition flex flex-col justify-between"
//                 >
//                   <div className="relative">
//                     {firstMedia ? (
//                       firstMedia.videosOrImageUrlType === "Video" ? (
//                         <div className="relative bg-black h-52 overflow-hidden flex items-center justify-center">
//                           <video
//                             src={firstMedia.videosOrImageUrl}
//                             controls
//                             className="w-full h-52 object-cover"
//                           />
//                           <span className="absolute top-3 left-3 bg-red-600/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium z-10 pointer-events-none">
//                             <FaVideo /> Video
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="relative h-52 overflow-hidden">
//                           <img
//                             src={firstMedia.videosOrImageUrl || firstMedia.thumbnail}
//                             alt={albumTitle}
//                             className="w-full h-52 object-cover"
//                           />
//                           <span className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium z-10">
//                             <FaImage /> Photo
//                           </span>
//                         </div>
//                       )
//                     ) : (
//                       <div className="relative h-52 overflow-hidden">
//                         <img
//                           src={
//                             album.thumbnail ||
//                             "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600"
//                           }
//                           alt={albumTitle}
//                           className="w-full h-52 object-cover"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-4 flex-1 flex flex-col justify-between">
//                     <div>
//                       <h3 className="font-bold text-lg">{albumTitle}</h3>

//                       <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
//                         <span>{albumDate}</span>
//                         {albumMediaList.length > 0 && (
//                           <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
//                             {albumMediaList.length} {albumMediaList.length === 1 ? "media" : "media items"}
//                           </span>
//                         )}
//                       </div>

//                       {album.location && (
//                         <p className="text-gray-400 text-xs mt-1">
//                           📍 {album.location}
//                         </p>
//                       )}
//                     </div>

//                     <div className="mt-4 flex gap-2">
//                       <Link
//                         to={`/admin/albums?eventId=${album._id}`}
//                         className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2.5 rounded-xl font-medium transition text-sm flex items-center justify-center gap-2"
//                       >
//                         <FaEye /> View Album
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             staticAlbums.map((album) => (
//               <div
//                 key={album.id}
//                 className="rounded-xl overflow-hidden border hover:shadow-lg transition flex flex-col justify-between"
//               >
//                 <img
//                   src={album.image}
//                   alt={album.title}
//                   className="w-full h-52 object-cover"
//                 />

//                 <div className="p-4 flex-1 flex flex-col justify-between">
//                   <div>
//                     <h3 className="font-bold">{album.title}</h3>

//                     <p className="text-gray-500 mt-2 text-sm">{album.date}</p>
//                   </div>

//                   <Link
//                     to="/admin/albums"
//                     className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded-lg block font-medium transition"
//                   >
//                     View Album
//                   </Link>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Booking History */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-2xl font-bold mb-6">Booking History</h2>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left p-4">Booking ID</th>

//                 <th className="text-left p-4">Event</th>

//                 <th className="text-left p-4">Date</th>

//                 <th className="text-left p-4">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {bookings.map((booking) => (
//                 <tr key={booking.id} className="border-t">
//                   <td className="p-4">{booking.id}</td>

//                   <td className="p-4">{booking.event}</td>

//                   <td className="p-4">{booking.date}</td>

//                   <td className="p-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm ${
//                         booking.status === "Confirmed"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-yellow-100 text-yellow-600"
//                       }`}
//                     >
//                       {booking.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDetailsPage;

import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaImages,
  FaCalendarCheck,
  FaHeart,
  FaDownload,
  FaEdit,
  FaVideo,
  FaImage,
  FaEye,
  FaUser,
  FaCheckCircle,
  FaCamera,
  FaChevronRight,
} from "react-icons/fa";

import EditUserDialog from "../../components/admindilog/EditUserDialog";

import {
  getUserById,
  userUpdateProfile,
} from "../../app/auth/authThunk";

import {
  getAllEventByFilter,
} from "../../app/event/eventThunk";

import {
  getMediaByFilter,
} from "../../app/media/mediaThunk";


/* =========================================================
   STATIC FALLBACK ALBUMS
========================================================= */

const staticAlbums = [
  {
    id: 1,
    title: "Rahul & Priya Wedding",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900",
    date: "25 May 2026",
  },
  {
    id: 2,
    title: "Engagement Ceremony",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900",
    date: "12 June 2026",
  },
  {
    id: 3,
    title: "Birthday Celebration",
    image:
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=900",
    date: "18 July 2026",
  },
];


/* =========================================================
   STATIC BOOKINGS
========================================================= */

const bookings = [
  {
    id: "BK1001",
    event: "Wedding",
    date: "25 Dec 2026",
    status: "Confirmed",
  },
  {
    id: "BK1002",
    event: "Reception",
    date: "28 Dec 2026",
    status: "Pending",
  },
];


/* =========================================================
   MAIN COMPONENT
========================================================= */

const UserDetailsPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);

  const [userAlbums, setUserAlbums] = useState([]);

  const [userMedia, setUserMedia] = useState([]);

  const [loadingUser, setLoadingUser] = useState(true);

  const [loadingAlbums, setLoadingAlbums] = useState(true);

  const [openEdit, setOpenEdit] = useState(false);

  const albumsRef = useRef(null);


  /* =======================================================
     FETCH USER
  ======================================================= */

  const fetchUserDetails = async () => {
    if (!id) return;

    setLoadingUser(true);

    try {
      const res = await dispatch(getUserById(id)).unwrap();

      if (res?.success) {
        setUserData(res.data);
      }
    } catch (err) {
      toast.error(
        err?.message || "Failed to fetch user details"
      );
    } finally {
      setLoadingUser(false);
    }
  };


  /* =======================================================
     FETCH ALBUMS + MEDIA
  ======================================================= */

  const fetchUserAlbums = async () => {
    if (!id) return;

    setLoadingAlbums(true);

    try {
      const [eventsRes, mediaRes] = await Promise.all([
        dispatch(
          getAllEventByFilter({
            userId: id,
            limit: 100,
          })
        ).unwrap(),

        dispatch(
          getMediaByFilter({
            userId: id,
            limit: 100,
          })
        ).unwrap(),
      ]);

      if (eventsRes?.success) {
        setUserAlbums(eventsRes.data || []);
      }

      if (mediaRes?.success) {
        setUserMedia(mediaRes.data || []);
      }
    } catch (err) {
      console.error(
        "Failed to fetch user albums/media:",
        err
      );
    } finally {
      setLoadingAlbums(false);
    }
  };


  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    fetchUserDetails();
    fetchUserAlbums();
  }, [id]);


  /* =======================================================
     UPDATE USER
  ======================================================= */

  const handleUpdate = async (updatedUser) => {
    const result = await dispatch(
      userUpdateProfile({
        userId: id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
      })
    );

    if (userUpdateProfile.fulfilled.match(result)) {
      toast.success("User updated successfully");

      setOpenEdit(false);

      fetchUserDetails();
    } else {
      toast.error(
        result.payload?.message ||
          "Failed to update user"
      );
    }
  };


  /* =======================================================
     SCROLL ALBUMS
  ======================================================= */

  const scrollToAlbums = () => {
    if (albumsRef.current) {
      albumsRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };


  /* =======================================================
     JOINED DATE
  ======================================================= */

  const formattedJoinedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "15 Jan 2026";


  /* =======================================================
     PROFILE IMAGE
  ======================================================= */

  const profileImage =
    userData?.profileImage ||
    "https://i.pravatar.cc/400?img=11";


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden pb-10">

      {/* ===================================================
          BACKGROUND DECORATION
      =================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div
          className="
            absolute
            -left-40
            top-20
            h-96
            w-96
            rounded-full
            bg-purple-300/20
            blur-3xl
            animate-pulse
          "
        />

        <div
          className="
            absolute
            right-0
            top-96
            h-[500px]
            w-[500px]
            rounded-full
            bg-violet-300/20
            blur-3xl
          "
        />

      </div>


      {/* ===================================================
          EDIT USER DIALOG
      =================================================== */}

      <EditUserDialog
        open={openEdit}
        user={userData}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdate}
      />


      {/* ===================================================
          BACK BUTTON
      =================================================== */}

      <div className="animate-pageIn">

        <Link
          to="/admin/users"
          className="
            group
            mb-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-purple-100
            bg-white/80
            px-4
            py-2.5
            font-semibold
            text-purple-600
            shadow-sm
            backdrop-blur
            transition-all
            duration-300
            hover:-translate-x-1
            hover:bg-purple-50
            hover:shadow-md
          "
        >

          <FaArrowLeft
            className="
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
          />

          Back to Users

        </Link>


        {/* =================================================
            PROFILE HERO
        ================================================== */}

        <div
          className="
            relative
            mb-8
            overflow-hidden
            rounded-[30px]
            border
            border-white
            bg-white/90
            shadow-[0_20px_70px_rgba(91,33,182,0.12)]
            backdrop-blur-xl
          "
        >

          {/* Gradient top */}

          <div
            className="
              absolute
              left-0
              right-0
              top-0
              h-40
              bg-gradient-to-r
              from-purple-600
              via-violet-600
              to-fuchsia-600
            "
          />

          {/* Decorative circles */}

          <div
            className="
              absolute
              -right-20
              -top-28
              h-72
              w-72
              rounded-full
              border-[35px]
              border-white/10
            "
          />

          <div
            className="
              absolute
              -left-20
              top-10
              h-52
              w-52
              rounded-full
              border-[25px]
              border-white/10
            "
          />


          {/* Profile content */}

          <div
            className="
              relative
              flex
              flex-col
              gap-8
              px-6
              pb-8
              pt-24
              lg:flex-row
              lg:items-end
              lg:px-10
            "
          >

            {/* Profile image */}

            <div className="relative mx-auto lg:mx-0">

              <div
                className="
                  absolute
                  -inset-3
                  rounded-full
                  bg-white/30
                  blur-md
                "
              />

              <div
                className="
                  relative
                  h-36
                  w-36
                  overflow-hidden
                  rounded-full
                  border-[6px]
                  border-white
                  bg-white
                  shadow-2xl
                  transition-transform
                  duration-500
                  hover:scale-105
                "
              >

                <img
                  src={profileImage}
                  alt={
                    userData?.name ||
                    "User Avatar"
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

              </div>


              {/* Online badge */}

              <div
                className="
                  absolute
                  bottom-2
                  right-2
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-white
                  bg-green-500
                  text-white
                  shadow-lg
                "
              >
                <FaCheckCircle className="text-sm" />
              </div>

            </div>


            {/* User information */}

            <div className="flex-1 text-center lg:text-left">

              <div
                className="
                  mb-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-purple-100
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  text-purple-700
                "
              >

                <FaUser />

                {userData?.userType ||
                  "Registered User"}

              </div>


              <h1
                className="
                  text-3xl
                  font-extrabold
                  tracking-tight
                  text-gray-900
                  sm:text-4xl
                "
              >
                {userData?.name ||
                  "Dinkar Paswan"}
              </h1>


              <p className="mt-2 text-gray-500">
                Manage user profile, albums and
                booking activity.
              </p>


              {/* Contact information */}

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  justify-center
                  gap-3
                  lg:justify-start
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gray-50
                    px-4
                    py-2.5
                    text-sm
                    text-gray-600
                  "
                >
                  <FaEnvelope className="text-purple-500" />

                  {userData?.email ||
                    "dinkar@gmail.com"}
                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gray-50
                    px-4
                    py-2.5
                    text-sm
                    text-gray-600
                  "
                >
                  <FaPhone className="text-green-500" />

                  {userData?.phoneNumber ||
                    "+91 9876543210"}
                </div>

              </div>

            </div>


            {/* Edit */}

            <button
              onClick={() => setOpenEdit(true)}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-600
                px-6
                py-3.5
                font-bold
                text-white
                shadow-lg
                shadow-purple-300/30
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-white/20
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <span className="relative flex items-center justify-center gap-2">

                <FaEdit />

                Edit User

              </span>

            </button>

          </div>


          {/* Bottom details */}

          <div
            className="
              grid
              grid-cols-1
              border-t
              border-gray-100
              bg-gray-50/70
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                border-b
                border-gray-100
                p-4
                text-sm
                text-gray-600
                lg:border-b-0
                lg:border-r
              "
            >
              <FaMapMarkerAlt className="text-red-500" />

              {userData?.address ||
                "Begusarai, Bihar"}
            </div>


            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                border-b
                border-gray-100
                p-4
                text-sm
                text-gray-600
                lg:border-b-0
                lg:border-r
              "
            >
              <FaCalendarAlt className="text-blue-500" />

              Joined {formattedJoinedDate}
            </div>


            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                p-4
                text-sm
                text-gray-600
              "
            >
              <FaCamera className="text-purple-500" />

              Digital Album Client

            </div>

          </div>

        </div>


        {/* =================================================
            STATS
        ================================================== */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {/* Albums */}

          <div
            onClick={scrollToAlbums}
            className="
              group
              cursor-pointer
              rounded-2xl
              border
              border-purple-100
              bg-white/90
              p-5
              shadow-sm
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
              hover:shadow-purple-100
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-100
                  text-purple-600
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  group-hover:rotate-6
                "
              >
                <FaImages className="text-xl" />
              </div>

              <FaChevronRight
                className="
                  text-gray-300
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-purple-500
                "
              />

            </div>


            <h2 className="mt-5 text-3xl font-extrabold text-gray-800">
              {userAlbums.length}
            </h2>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Total Albums
            </p>

          </div>


          {/* Bookings */}

          <div
            className="
              group
              rounded-2xl
              border
              border-green-100
              bg-white/90
              p-5
              shadow-sm
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
              hover:shadow-green-100
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-green-100
                text-green-600
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <FaCalendarCheck className="text-xl" />
            </div>

            <h2 className="mt-5 text-3xl font-extrabold text-gray-800">
              5
            </h2>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Total Bookings
            </p>

          </div>


          {/* Favorites */}

          <div
            className="
              group
              rounded-2xl
              border
              border-pink-100
              bg-white/90
              p-5
              shadow-sm
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
              hover:shadow-pink-100
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-pink-100
                text-pink-600
                transition-transform
                duration-300
                group-hover:scale-110
                group-hover:rotate-[-8deg]
              "
            >
              <FaHeart className="text-xl" />
            </div>

            <h2 className="mt-5 text-3xl font-extrabold text-gray-800">
              124
            </h2>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Favorites
            </p>

          </div>


          {/* Media */}

          <div
            className="
              group
              rounded-2xl
              border
              border-orange-100
              bg-white/90
              p-5
              shadow-sm
              backdrop-blur
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-xl
              hover:shadow-orange-100
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-orange-100
                text-orange-500
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <FaDownload className="text-xl" />
            </div>

            <h2 className="mt-5 text-3xl font-extrabold text-gray-800">
              {userMedia.length}
            </h2>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Total Media
            </p>

          </div>

        </div>


        {/* =================================================
            ALBUM SECTION
        ================================================== */}

        <div
          ref={albumsRef}
          id="user-albums-section"
          className="
            mb-8
            overflow-hidden
            rounded-[26px]
            border
            border-gray-100
            bg-white/90
            p-5
            shadow-lg
            backdrop-blur
            sm:p-7
          "
        >

          {/* Section header */}

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
                  <FaImages />
                </div>

                <div>

                  <h2 className="text-2xl font-extrabold text-gray-800">
                    User Albums
                  </h2>

                  <p className="text-sm text-gray-400">
                    Memories and events created for this user
                  </p>

                </div>

              </div>

            </div>


            <Link
              to={`/admin/albums?userId=${id}`}
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-purple-50
                px-5
                py-3
                font-bold
                text-purple-600
                transition-all
                duration-300
                hover:bg-purple-600
                hover:text-white
              "
            >

              View All

              <FaChevronRight
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />

            </Link>

          </div>


          {/* Albums */}

          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {loadingAlbums ? (

              <div className="col-span-full py-16 text-center">

                <div
                  className="
                    mx-auto
                    h-12
                    w-12
                    animate-spin
                    rounded-full
                    border-4
                    border-purple-100
                    border-t-purple-600
                  "
                />

                <p className="mt-4 text-sm text-gray-400">
                  Loading user albums...
                </p>

              </div>

            ) : userAlbums.length > 0 ? (

              userAlbums.map((album) => {

                const albumTitle =
                  [
                    album.brideName,
                    album.groomName,
                  ]
                    .filter(Boolean)
                    .join(" & ") ||
                  album.eventSubCategoryId?.name ||
                  album.location ||
                  "Album Event";


                const albumDate = album.eventDate
                  ? new Date(
                      album.eventDate
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Date N/A";


                const albumMediaList =
                  userMedia.filter(
                    (m) =>
                      String(
                        m.eventId?._id ||
                          m.eventId
                      ) === String(album._id)
                  );


                const firstMedia =
                  albumMediaList[0];


                return (
                  <div
                    key={album._id}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-100
                      bg-white
                      shadow-sm
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:shadow-2xl
                    "
                  >

                    {/* Image */}

                    <div className="relative h-56 overflow-hidden">

                      {firstMedia ? (

                        firstMedia.videosOrImageUrlType ===
                        "Video" ? (

                          <div className="relative h-full bg-black">

                            <video
                              src={
                                firstMedia.videosOrImageUrl
                              }
                              controls
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-700
                                group-hover:scale-105
                              "
                            />

                            <span
                              className="
                                absolute
                                left-3
                                top-3
                                z-10
                                flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-red-600/90
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                text-white
                                shadow-lg
                              "
                            >
                              <FaVideo />

                              Video

                            </span>

                          </div>

                        ) : (

                          <div className="relative h-full">

                            <img
                              src={
                                firstMedia.videosOrImageUrl ||
                                firstMedia.thumbnail
                              }
                              alt={albumTitle}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-700
                                group-hover:scale-110
                              "
                            />

                            <div
                              className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/50
                                via-transparent
                                to-transparent
                              "
                            />

                            <span
                              className="
                                absolute
                                left-3
                                top-3
                                flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-purple-600/90
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                text-white
                                shadow-lg
                              "
                            >
                              <FaImage />

                              Photo

                            </span>

                          </div>

                        )

                      ) : (

                        <div className="relative h-full">

                          <img
                            src={
                              album.thumbnail ||
                              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900"
                            }
                            alt={albumTitle}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-700
                              group-hover:scale-110
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-0
                              bg-gradient-to-t
                              from-black/50
                              via-transparent
                              to-transparent
                            "
                          />

                        </div>

                      )}

                    </div>


                    {/* Details */}

                    <div className="p-5">

                      <h3
                        className="
                          truncate
                          text-lg
                          font-extrabold
                          text-gray-800
                        "
                      >
                        {albumTitle}
                      </h3>


                      <div
                        className="
                          mt-2
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          text-sm
                          text-gray-500
                        "
                      >

                        <span>
                          {albumDate}
                        </span>


                        {albumMediaList.length > 0 && (

                          <span
                            className="
                              rounded-full
                              bg-purple-100
                              px-2.5
                              py-1
                              text-xs
                              font-bold
                              text-purple-700
                            "
                          >
                            {albumMediaList.length} media
                          </span>

                        )}

                      </div>


                      {album.location && (

                        <p
                          className="
                            mt-2
                            truncate
                            text-xs
                            text-gray-400
                          "
                        >
                          📍 {album.location}
                        </p>

                      )}


                      <Link
                        to={`/admin/albums?eventId=${album._id}`}
                        className="
                          group/btn
                          mt-5
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-gradient-to-r
                          from-purple-600
                          to-violet-600
                          py-3
                          font-bold
                          text-white
                          shadow-md
                          shadow-purple-200
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:shadow-lg
                        "
                      >

                        <FaEye />

                        View Album

                        <FaChevronRight
                          className="
                            text-xs
                            transition-transform
                            group-hover/btn:translate-x-1
                          "
                        />

                      </Link>

                    </div>

                  </div>
                );
              })

            ) : (

              staticAlbums.map((album) => (

                <div
                  key={album.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                >

                  <div className="relative h-56 overflow-hidden">

                    <img
                      src={album.image}
                      alt={album.title}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/60
                        via-transparent
                        to-transparent
                      "
                    />

                    <span
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-purple-600/90
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      <FaImage />

                      Photo

                    </span>

                  </div>


                  <div className="p-5">

                    <h3 className="text-lg font-extrabold text-gray-800">
                      {album.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {album.date}
                    </p>


                    <Link
                      to="/admin/albums"
                      className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gradient-to-r
                        from-purple-600
                        to-violet-600
                        py-3
                        font-bold
                        text-white
                        shadow-md
                        shadow-purple-200
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-lg
                      "
                    >

                      <FaEye />

                      View Album

                    </Link>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>


        {/* =================================================
            BOOKING HISTORY
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[26px]
            border
            border-gray-100
            bg-white/90
            p-5
            shadow-lg
            backdrop-blur
            sm:p-7
          "
        >

          <div className="mb-6 flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-green-100
                text-green-600
              "
            >
              <FaCalendarCheck />
            </div>

            <div>

              <h2 className="text-2xl font-extrabold text-gray-800">
                Booking History
              </h2>

              <p className="text-sm text-gray-400">
                Recent bookings associated with this user
              </p>

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[600px]">

              <thead>

                <tr className="border-b border-gray-100">

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Booking ID
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Event
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Date
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {bookings.map((booking) => (

                  <tr
                    key={booking.id}
                    className="
                      group
                      border-b
                      border-gray-50
                      transition-colors
                      duration-300
                      hover:bg-purple-50/50
                    "
                  >

                    <td className="px-4 py-5">

                      <span
                        className="
                          rounded-lg
                          bg-purple-50
                          px-3
                          py-1.5
                          text-sm
                          font-bold
                          text-purple-600
                        "
                      >
                        {booking.id}
                      </span>

                    </td>


                    <td className="px-4 py-5">

                      <span className="font-semibold text-gray-700">
                        {booking.event}
                      </span>

                    </td>


                    <td className="px-4 py-5 text-sm text-gray-500">
                      {booking.date}
                    </td>


                    <td className="px-4 py-5">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          ${
                            booking.status ===
                            "Confirmed"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }
                        `}
                      >

                        <span className="h-1.5 w-1.5 rounded-full bg-current" />

                        {booking.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* ===================================================
          ANIMATIONS
      =================================================== */}

      <style>{`

        @keyframes pageIn {

          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .animate-pageIn {
          animation: pageIn 0.6s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {

          .animate-pageIn {
            animation: none;
          }

        }

      `}</style>

    </div>
  );
};

export default UserDetailsPage;