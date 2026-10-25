// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../../config/axios";
// import {
//   FaUserTie,
//   FaUserFriends,
//   FaPhotoVideo,
//   FaCalendarAlt,
//   FaPlus,
//   FaArrowRight,
//   FaShieldAlt,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaLayerGroup,
//   FaCog,
//   FaImages,
//   FaUserCheck,
//   FaUserClock,
//   FaRedo,
// } from "react-icons/fa";

// const SuperAdminDashboard = () => {
//   const { admin } = useSelector((state) => state.admin);
//   const navigate = useNavigate();

//   const [admins, setAdmins] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [mediaList, setMediaList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchDashboardData = async () => {
//     try {
//       setRefreshing(true);
//       const [adminsRes, clientsRes, eventsRes, mediaRes] = await Promise.allSettled([
//         axiosInstance.get("/admin/getAllAdmins"),
//         axiosInstance.get("/users/getUserByFilter", {
//           params: { userType: "User", limit: "All" },
//         }),
//         axiosInstance.get("/admin/getEventByFilter", {
//           params: { limit: 10 },
//         }),
//         axiosInstance.get("/admin/getMediaByFilter", {
//           params: { limit: 12 },
//         }),
//       ]);

//       if (adminsRes.status === "fulfilled") {
//         setAdmins(adminsRes.value.data?.data || []);
//       }
//       if (clientsRes.status === "fulfilled") {
//         setClients(clientsRes.value.data?.data || []);
//       }
//       if (eventsRes.status === "fulfilled") {
//         setEvents(eventsRes.value.data?.data || []);
//       }
//       if (mediaRes.status === "fulfilled") {
//         setMediaList(mediaRes.value.data?.data || []);
//       }
//     } catch (error) {
//       console.error("Super Admin dashboard error:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleToggleAdminStatus = async (adminItem) => {
//     try {
//       await axiosInstance.put("/admin/userIsActive", { userId: adminItem._id });
//       fetchDashboardData();
//     } catch (err) {
//       console.error("Failed to toggle admin status:", err);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Compute calculated metrics
//   const totalAdmins = admins.length;
//   const activeAdmins = admins.filter((a) => a.isActive).length;

//   const totalClients = clients.length;
//   const assignedClients = clients.filter((c) => c.ownerAdminId).length;
//   const unassignedClients = totalClients - assignedClients;

//   const totalEvents = events.length;
//   const totalMedia = mediaList.length;

//   // Map client count per admin
//   const adminClientCounts = admins.map((adminItem) => {
//     const count = clients.filter(
//       (c) =>
//         (typeof c.ownerAdminId === "object"
//           ? c.ownerAdminId?._id
//           : c.ownerAdminId) === adminItem._id
//     ).length;
//     return { ...adminItem, clientCount: count };
//   });

//   return (
//     <div className="space-y-8 pb-12">
//       {/* Hero Welcome Banner */}
//       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-6 md:p-8 shadow-xl shadow-indigo-950/20">
//         <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
//         <div className="absolute right-32 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

//         <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200 flex items-center gap-1.5">
//                 <FaShieldAlt className="text-purple-300" /> Super Administrator Console
//               </span>
//               <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live System
//               </span>
//             </div>
//             <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
//               Welcome back, {admin?.name || "Master Admin"}
//             </h1>
//             <p className="text-purple-200/90 text-sm md:text-base mt-1.5 max-w-2xl leading-relaxed">
//               Complete platform governance. Monitor studio administrators, assign & manage client relationships, and oversee all media assets across all albums.
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <button
//               onClick={fetchDashboardData}
//               disabled={refreshing}
//               className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition backdrop-blur-md"
//               title="Refresh Data"
//             >
//               <FaRedo className={`text-sm ${refreshing ? "animate-spin" : ""}`} />
//             </button>
//             <button
//               onClick={() => navigate("/super-admin/admins")}
//               className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-lg shadow-purple-500/30 transition transform hover:-translate-y-0.5"
//             >
//               <FaPlus />
//               <span>Add Studio Admin</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* KPI Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {/* Studio Admins */}
//         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
//               Studio Admins
//             </span>
//             <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
//               <FaUserTie />
//             </div>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-3xl font-black text-gray-900 tracking-tight">
//               {loading ? "--" : totalAdmins}
//             </h3>
//             <div className="flex items-center gap-2 mt-2 text-xs">
//               <span className="text-emerald-600 font-semibold flex items-center gap-1">
//                 <FaCheckCircle /> {activeAdmins} Active
//               </span>
//               <span className="text-gray-300">•</span>
//               <Link to="/super-admin/admins" className="text-purple-600 hover:underline font-medium">
//                 Manage Admins →
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Total Clients */}
//         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
//               Client Accounts
//             </span>
//             <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
//               <FaUserFriends />
//             </div>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-3xl font-black text-gray-900 tracking-tight">
//               {loading ? "--" : totalClients}
//             </h3>
//             <div className="flex items-center gap-2 mt-2 text-xs">
//               <span className="text-blue-600 font-semibold flex items-center gap-1">
//                 <FaUserCheck /> {assignedClients} Assigned
//               </span>
//               <span className="text-gray-300">•</span>
//               <Link to="/super-admin/clients" className="text-purple-600 hover:underline font-medium">
//                 Manage Clients →
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Unassigned Pool */}
//         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
//               Unassigned Pool
//             </span>
//             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition duration-300 ${unassignedClients > 0 ? "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white" : "bg-emerald-50 text-emerald-600"}`}>
//               <FaUserClock />
//             </div>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-3xl font-black text-gray-900 tracking-tight">
//               {loading ? "--" : unassignedClients}
//             </h3>
//             <div className="flex items-center gap-2 mt-2 text-xs">
//               {unassignedClients > 0 ? (
//                 <span className="text-amber-600 font-semibold flex items-center gap-1">
//                   <FaExclamationTriangle /> Requires assignment
//                 </span>
//               ) : (
//                 <span className="text-emerald-600 font-semibold flex items-center gap-1">
//                   <FaCheckCircle /> All clients assigned
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Media & Albums */}
//         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
//               Central Media Hub
//             </span>
//             <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
//               <FaPhotoVideo />
//             </div>
//           </div>
//           <div className="mt-4">
//             <h3 className="text-3xl font-black text-gray-900 tracking-tight">
//               {loading ? "--" : totalMedia}
//             </h3>
//             <div className="flex items-center gap-2 mt-2 text-xs">
//               <span className="text-indigo-600 font-semibold">
//                 Super Admin Access
//               </span>
//               <span className="text-gray-300">•</span>
//               <Link to="/super-admin/media" className="text-purple-600 hover:underline font-medium">
//                 View All Media →
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Unassigned Clients Banner Notification if any */}
//       {unassignedClients > 0 && (
//         <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg shrink-0 mt-0.5">
//               <FaExclamationTriangle />
//             </div>
//             <div>
//               <h4 className="font-bold text-amber-900 text-base">
//                 {unassignedClients} Client{unassignedClients > 1 ? "s" : ""} pending Studio Admin Assignment
//               </h4>
//               <p className="text-xs md:text-sm text-amber-700 mt-0.5">
//                 These clients are registered on the platform but have not yet been assigned to a studio administrator. Assign them to grant local admin access.
//               </p>
//             </div>
//           </div>
//           <Link
//             to="/super-admin/clients?filter=unassigned"
//             className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs whitespace-nowrap shadow-sm transition"
//           >
//             Assign Clients Now <FaArrowRight />
//           </Link>
//         </div>
//       )}

//       {/* Quick Access Control Grid */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-900">
//             Dedicated Management Modules
//           </h2>
//           <span className="text-xs text-gray-500">
//             Independent workspaces for Super Admin operations
//           </span>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
//           {/* Module 1: Admins */}
//           <Link
//             to="/super-admin/admins"
//             className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
//           >
//             <div>
//               <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
//                 <FaUserTie />
//               </div>
//               <h3 className="font-bold text-gray-800 text-base group-hover:text-purple-600 transition">
//                 Manage Studio Admins
//               </h3>
//               <p className="text-xs text-gray-500 mt-1 leading-relaxed">
//                 Add, edit, deactivate, or delete studio administrators. Monitor their account statuses and contact info.
//               </p>
//             </div>
//             <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-purple-600">
//               <span>{totalAdmins} Registered Admins</span>
//               <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
//             </div>
//           </Link>

//           {/* Module 2: Clients & Assignment */}
//           <Link
//             to="/super-admin/clients"
//             className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
//           >
//             <div>
//               <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
//                 <FaUserFriends />
//               </div>
//               <h3 className="font-bold text-gray-800 text-base group-hover:text-blue-600 transition">
//                 Clients & Assignments
//               </h3>
//               <p className="text-xs text-gray-500 mt-1 leading-relaxed">
//                 Full client registry. Filter by studio admin, re-assign clients, create, edit, or delete client profiles.
//               </p>
//             </div>
//             <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-blue-600">
//               <span>{assignedClients} Assigned / {unassignedClients} Unassigned</span>
//               <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
//             </div>
//           </Link>

//           {/* Module 3: Media Hub */}
//           <Link
//             to="/super-admin/media"
//             className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
//           >
//             <div>
//               <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
//                 <FaPhotoVideo />
//               </div>
//               <h3 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition">
//                 Central Media Library
//               </h3>
//               <p className="text-xs text-gray-500 mt-1 leading-relaxed">
//                 Super Admin unrestricted media view: inspect, upload, toggle downloads, or delete photos and videos platform-wide.
//               </p>
//             </div>
//             <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-indigo-600">
//               <span>Inspect All Media</span>
//               <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
//             </div>
//           </Link>

//           {/* Module 4: Categories & Events */}
//           <Link
//             to="/super-admin/categories"
//             className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
//           >
//             <div>
//               <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
//                 <FaLayerGroup />
//               </div>
//               <h3 className="font-bold text-gray-800 text-base group-hover:text-emerald-600 transition">
//                 Categories & Taxonomy
//               </h3>
//               <p className="text-xs text-gray-500 mt-1 leading-relaxed">
//                 Configure global album categories and subcategories used by all studio administrators for photoshoot organization.
//               </p>
//             </div>
//             <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-emerald-600">
//               <span>Manage Structure</span>
//               <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
//             </div>
//           </Link>
//         </div>
//       </div>

//       {/* Two Column Layout: Studio Admins Distribution & Client Assignment Status */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left 2 Cols: Studio Admins Overview */}
//         <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-bold text-gray-900">
//                 Studio Administrators Overview
//               </h3>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 Active studio admins and their currently managed clients
//               </p>
//             </div>
//             <Link
//               to="/super-admin/admins"
//               className="text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1"
//             >
//               View all ({admins.length}) <FaArrowRight className="text-[10px]" />
//             </Link>
//           </div>

//           {loading ? (
//             <div className="py-12 text-center text-gray-400 text-sm">
//               Loading studio admins...
//             </div>
//           ) : adminClientCounts.length === 0 ? (
//             <div className="py-12 text-center">
//               <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
//                 <FaUserTie />
//               </div>
//               <p className="text-gray-600 font-semibold text-sm">No studio admins registered yet</p>
//               <Link
//                 to="/super-admin/admins"
//                 className="mt-3 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-700 transition"
//               >
//                 <FaPlus /> Create First Admin
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {adminClientCounts.slice(0, 5).map((adm) => (
//                 <div
//                   key={adm._id}
//                   className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 hover:bg-purple-50/50 border border-gray-100 transition-all"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={adm.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(adm.name)}&background=8b5cf6&color=fff`}
//                       alt={adm.name}
//                       className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200"
//                     />
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <p className="font-bold text-sm text-gray-800">{adm.name}</p>
//                         <button
//                           type="button"
//                           onClick={() => handleToggleAdminStatus(adm)}
//                           title={adm.isActive ? "Click to Deactivate Admin" : "Click to Activate Admin"}
//                           className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition flex items-center gap-1 cursor-pointer ${
//                             adm.isActive
//                               ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
//                               : "bg-red-100 text-red-700 hover:bg-red-200"
//                           }`}
//                         >
//                           <span className={`w-1.5 h-1.5 rounded-full ${adm.isActive ? "bg-emerald-500" : "bg-red-500"}`}></span>
//                           <span>{adm.isActive ? "Active" : "Inactive"}</span>
//                         </button>
//                       </div>
//                       <p className="text-xs text-gray-500">{adm.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <div className="text-right">
//                       <span className="text-sm font-bold text-gray-800">
//                         {adm.clientCount}
//                       </span>
//                       <p className="text-[10px] font-semibold text-gray-400 uppercase">
//                         Clients
//                       </p>
//                     </div>
//                     <Link
//                       to={`/super-admin/clients?adminId=${adm._id}`}
//                       className="px-3 py-1.5 rounded-xl bg-white text-purple-700 text-xs font-semibold border border-purple-200 hover:bg-purple-600 hover:text-white transition shadow-sm"
//                     >
//                       View Clients
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right 1 Col: Platform Health & Quick Stats */}
//         <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
//           <div>
//             <h3 className="text-lg font-bold text-gray-900 mb-4">
//               Assignment Ratio
//             </h3>

//             {/* Distribution Bar */}
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between text-xs font-semibold mb-1.5 text-gray-600">
//                   <span>Assigned Clients ({assignedClients})</span>
//                   <span>
//                     {totalClients > 0
//                       ? Math.round((assignedClients / totalClients) * 100)
//                       : 0}
//                     %
//                   </span>
//                 </div>
//                 <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
//                     style={{
//                       width: `${
//                         totalClients > 0
//                           ? (assignedClients / totalClients) * 100
//                           : 0
//                       }%`,
//                     }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="pt-2 border-t space-y-2.5">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-gray-500">Unassigned Clients</span>
//                   <span className="font-bold text-amber-600">
//                     {unassignedClients}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-gray-500">Active Admins</span>
//                   <span className="font-bold text-emerald-600">
//                     {activeAdmins} / {totalAdmins}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="text-gray-500">Access Policy</span>
//                   <span className="font-bold text-purple-700">
//                     SuperAdmin Full
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 pt-5 border-t">
//             <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
//               Super Admin Quick Tools
//             </h4>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 onClick={() => navigate("/super-admin/admins")}
//                 className="p-2.5 text-center rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition"
//               >
//                 + Studio Admin
//               </button>
//               <button
//                 onClick={() => navigate("/super-admin/clients")}
//                 className="p-2.5 text-center rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition"
//               >
//                 Assign Clients
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Media Preview Grid */}
//       <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
//         <div className="flex items-center justify-between mb-5">
//           <div>
//             <h3 className="text-lg font-bold text-gray-900">
//               Recent Media Across All Albums
//             </h3>
//             <p className="text-xs text-gray-500 mt-0.5">
//               Platform-wide photos and videos uploaded by admins and clients
//             </p>
//           </div>
//           <Link
//             to="/super-admin/media"
//             className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
//           >
//             Open Media Hub ({mediaList.length}) <FaArrowRight className="text-[10px]" />
//           </Link>
//         </div>

//         {loading ? (
//           <div className="py-8 text-center text-gray-400 text-sm">
//             Loading recent media...
//           </div>
//         ) : mediaList.length === 0 ? (
//           <div className="py-8 text-center text-gray-500 text-sm">
//             No media uploaded yet.
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
//             {mediaList.slice(0, 6).map((item) => (
//               <div
//                 key={item._id}
//                 onClick={() => navigate("/super-admin/media")}
//                 className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition"
//               >
//                 {item.videosOrImageUrlType === "Video" ? (
//                   <video
//                     src={item.videosOrImageUrl}
//                     className="w-full h-full object-cover"
//                     muted
//                   />
//                 ) : (
//                   <img
//                     src={item.videosOrImageUrl || item.thumbnail}
//                     alt="Album media"
//                     className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//                   />
//                 )}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2.5">
//                   <span className="text-[10px] text-white font-medium truncate">
//                     {item.videosOrImageUrlType}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import {
  FaUserTie,
  FaUserFriends,
  FaPhotoVideo,
  FaCalendarAlt,
  FaPlus,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLayerGroup,
  FaCog,
  FaImages,
  FaUserCheck,
  FaUserClock,
  FaRedo,
} from "react-icons/fa";

const SuperAdminDashboard = () => {
  const { admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [events, setEvents] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [adminsRes, clientsRes, eventsRes, mediaRes] = await Promise.allSettled([
        axiosInstance.get("/admin/getAllAdmins"),
        axiosInstance.get("/users/getUserByFilter", {
          params: { userType: "User", limit: "All" },
        }),
        axiosInstance.get("/admin/getEventByFilter", {
          params: { limit: 10 },
        }),
        axiosInstance.get("/admin/getMediaByFilter", {
          params: { limit: 12 },
        }),
      ]);

      if (adminsRes.status === "fulfilled") {
        setAdmins(adminsRes.value.data?.data || []);
      }
      if (clientsRes.status === "fulfilled") {
        setClients(clientsRes.value.data?.data || []);
      }
      if (eventsRes.status === "fulfilled") {
        setEvents(eventsRes.value.data?.data || []);
      }
      if (mediaRes.status === "fulfilled") {
        setMediaList(mediaRes.value.data?.data || []);
      }
    } catch (error) {
      console.error("Super Admin dashboard error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleAdminStatus = async (adminItem) => {
    try {
      await axiosInstance.put("/admin/userIsActive", { userId: adminItem._id });
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to toggle admin status:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute calculated metrics
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((a) => a.isActive).length;

  const totalClients = clients.length;
  const assignedClients = clients.filter((c) => c.ownerAdminId).length;
  const unassignedClients = totalClients - assignedClients;

  const totalEvents = events.length;
  const totalMedia = mediaList.length;

  // Map client count per admin
  const adminClientCounts = admins.map((adminItem) => {
    const count = clients.filter(
      (c) =>
        (typeof c.ownerAdminId === "object"
          ? c.ownerAdminId?._id
          : c.ownerAdminId) === adminItem._id
    ).length;
    return { ...adminItem, clientCount: count };
  });

  return (
    <div className="sa-dashboard space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="sa-hero relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-6 md:p-8 shadow-xl shadow-indigo-950/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                <FaShieldAlt className="text-purple-300" /> Super Administrator Console
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live System
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, {admin?.name || "Master Admin"}
            </h1>
            <p className="text-purple-200/90 text-sm md:text-base mt-1.5 max-w-2xl leading-relaxed">
              Complete platform governance. Monitor studio administrators, assign & manage client relationships, and oversee all media assets across all albums.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition backdrop-blur-md"
              title="Refresh Data"
            >
              <FaRedo className={`text-sm ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => navigate("/super-admin/admins")}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-lg shadow-purple-500/30 transition transform hover:-translate-y-0.5"
            >
              <FaPlus />
              <span>Add Studio Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Studio Admins */}
        <div className="sa-stat-card bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Studio Admins
            </span>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
              <FaUserTie />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {loading ? "--" : totalAdmins}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <FaCheckCircle /> {activeAdmins} Active
              </span>
              <span className="text-gray-300">•</span>
              <Link to="/super-admin/admins" className="text-purple-600 hover:underline font-medium">
                Manage Admins →
              </Link>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="sa-stat-card bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Client Accounts
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
              <FaUserFriends />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {loading ? "--" : totalClients}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-blue-600 font-semibold flex items-center gap-1">
                <FaUserCheck /> {assignedClients} Assigned
              </span>
              <span className="text-gray-300">•</span>
              <Link to="/super-admin/clients" className="text-purple-600 hover:underline font-medium">
                Manage Clients →
              </Link>
            </div>
          </div>
        </div>

        {/* Unassigned Pool */}
        <div className="sa-stat-card bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Unassigned Pool
            </span>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition duration-300 ${unassignedClients > 0 ? "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white" : "bg-emerald-50 text-emerald-600"}`}>
              <FaUserClock />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {loading ? "--" : unassignedClients}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              {unassignedClients > 0 ? (
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  <FaExclamationTriangle /> Requires assignment
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <FaCheckCircle /> All clients assigned
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Media & Albums */}
        <div className="sa-stat-card bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Central Media Hub
            </span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
              <FaPhotoVideo />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {loading ? "--" : totalMedia}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-indigo-600 font-semibold">
                Super Admin Access
              </span>
              <span className="text-gray-300">•</span>
              <Link to="/super-admin/media" className="text-purple-600 hover:underline font-medium">
                View All Media →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Unassigned Clients Banner Notification if any */}
      {unassignedClients > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg shrink-0 mt-0.5">
              <FaExclamationTriangle />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-base">
                {unassignedClients} Client{unassignedClients > 1 ? "s" : ""} pending Studio Admin Assignment
              </h4>
              <p className="text-xs md:text-sm text-amber-700 mt-0.5">
                These clients are registered on the platform but have not yet been assigned to a studio administrator. Assign them to grant local admin access.
              </p>
            </div>
          </div>
          <Link
            to="/super-admin/clients?filter=unassigned"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs whitespace-nowrap shadow-sm transition"
          >
            Assign Clients Now <FaArrowRight />
          </Link>
        </div>
      )}

      {/* Quick Access Control Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Dedicated Management Modules
          </h2>
          <span className="text-xs text-gray-500">
            Independent workspaces for Super Admin operations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Module 1: Admins */}
          <Link
            to="/super-admin/admins"
            className="sa-module-card bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
                <FaUserTie />
              </div>
              <h3 className="font-bold text-gray-800 text-base group-hover:text-purple-600 transition">
                Manage Studio Admins
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Add, edit, deactivate, or delete studio administrators. Monitor their account statuses and contact info.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>{totalAdmins} Registered Admins</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Clients & Assignment */}
          <Link
            to="/super-admin/clients"
            className="sa-module-card bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
                <FaUserFriends />
              </div>
              <h3 className="font-bold text-gray-800 text-base group-hover:text-blue-600 transition">
                Clients & Assignments
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Full client registry. Filter by studio admin, re-assign clients, create, edit, or delete client profiles.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>{assignedClients} Assigned / {unassignedClients} Unassigned</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 3: Media Hub */}
          <Link
            to="/super-admin/media"
            className="sa-module-card bg-white rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
                <FaPhotoVideo />
              </div>
              <h3 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition">
                Central Media Library
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Super Admin unrestricted media view: inspect, upload, toggle downloads, or delete photos and videos platform-wide.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Inspect All Media</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 4: Categories & Events */}
          <Link
            to="/super-admin/categories"
            className="sa-module-card bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition">
                <FaLayerGroup />
              </div>
              <h3 className="font-bold text-gray-800 text-base group-hover:text-emerald-600 transition">
                Categories & Taxonomy
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Configure global album categories and subcategories used by all studio administrators for photoshoot organization.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Manage Structure</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Studio Admins Distribution & Client Assignment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Studio Admins Overview */}
        <div className="sa-panel lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Studio Administrators Overview
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Active studio admins and their currently managed clients
              </p>
            </div>
            <Link
              to="/super-admin/admins"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1"
            >
              View all ({admins.length}) <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Loading studio admins...
            </div>
          ) : adminClientCounts.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                <FaUserTie />
              </div>
              <p className="text-gray-600 font-semibold text-sm">No studio admins registered yet</p>
              <Link
                to="/super-admin/admins"
                className="mt-3 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-700 transition"
              >
                <FaPlus /> Create First Admin
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {adminClientCounts.slice(0, 5).map((adm) => (
                <div
                  key={adm._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 hover:bg-purple-50/50 border border-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={adm.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(adm.name)}&background=8b5cf6&color=fff`}
                      alt={adm.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-gray-800">{adm.name}</p>
                        <button
                          type="button"
                          onClick={() => handleToggleAdminStatus(adm)}
                          title={adm.isActive ? "Click to Deactivate Admin" : "Click to Activate Admin"}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition flex items-center gap-1 cursor-pointer ${
                            adm.isActive
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${adm.isActive ? "bg-emerald-500" : "bg-red-500"}`}></span>
                          <span>{adm.isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">{adm.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-800">
                        {adm.clientCount}
                      </span>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">
                        Clients
                      </p>
                    </div>
                    <Link
                      to={`/super-admin/clients?adminId=${adm._id}`}
                      className="px-3 py-1.5 rounded-xl bg-white text-purple-700 text-xs font-semibold border border-purple-200 hover:bg-purple-600 hover:text-white transition shadow-sm"
                    >
                      View Clients
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Platform Health & Quick Stats */}
        <div className="sa-panel bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Assignment Ratio
            </h3>

            {/* Distribution Bar */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5 text-gray-600">
                  <span>Assigned Clients ({assignedClients})</span>
                  <span>
                    {totalClients > 0
                      ? Math.round((assignedClients / totalClients) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalClients > 0
                          ? (assignedClients / totalClients) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Unassigned Clients</span>
                  <span className="font-bold text-amber-600">
                    {unassignedClients}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Active Admins</span>
                  <span className="font-bold text-emerald-600">
                    {activeAdmins} / {totalAdmins}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Access Policy</span>
                  <span className="font-bold text-purple-700">
                    SuperAdmin Full
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Super Admin Quick Tools
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate("/super-admin/admins")}
                className="p-2.5 text-center rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition"
              >
                + Studio Admin
              </button>
              <button
                onClick={() => navigate("/super-admin/clients")}
                className="p-2.5 text-center rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition"
              >
                Assign Clients
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Analytics Charts */}
      <section className="sa-analytics-grid">
        <div className="sa-panel sa-chart-panel">
          <div className="sa-chart-heading">
            <div>
              <span className="sa-section-kicker">PLATFORM ANALYTICS</span>
              <h3 className="text-lg font-bold">Client Assignment Overview</h3>
              <p className="text-xs text-gray-500 mt-1">How client accounts are distributed across the platform</p>
            </div>
            <span className="sa-chart-tag">LIVE TOTALS</span>
          </div>

          <div className="sa-donut-layout">
            <div
              className="sa-donut-chart"
              style={{
                background: `conic-gradient(#c6a35f 0% ${totalClients > 0 ? (assignedClients / totalClients) * 100 : 0}%, #e9dfe3 ${totalClients > 0 ? (assignedClients / totalClients) * 100 : 0}% 100%)`,
              }}
              role="img"
              aria-label={`${assignedClients} assigned clients and ${unassignedClients} unassigned clients`}
            >
              <div className="sa-donut-center">
                <strong>{loading ? "—" : totalClients}</strong>
                <span>Total Clients</span>
              </div>
            </div>

            <div className="sa-chart-legend">
              <div className="sa-legend-row">
                <span className="sa-legend-dot assigned" />
                <div><span>Assigned</span><strong>{loading ? "—" : assignedClients}</strong></div>
                <small>{totalClients ? Math.round((assignedClients / totalClients) * 100) : 0}%</small>
              </div>
              <div className="sa-legend-row">
                <span className="sa-legend-dot unassigned" />
                <div><span>Unassigned</span><strong>{loading ? "—" : unassignedClients}</strong></div>
                <small>{totalClients ? Math.round((unassignedClients / totalClients) * 100) : 0}%</small>
              </div>
              <div className="sa-chart-note">
                {unassignedClients > 0 ? `${unassignedClients} account${unassignedClients === 1 ? "" : "s"} need an administrator.` : "All client accounts are assigned."}
              </div>
            </div>
          </div>
        </div>

        <div className="sa-panel sa-chart-panel">
          <div className="sa-chart-heading">
            <div>
              <span className="sa-section-kicker">TEAM PERFORMANCE</span>
              <h3 className="text-lg font-bold">Admin Workload</h3>
              <p className="text-xs text-gray-500 mt-1">Client accounts currently managed per studio admin</p>
            </div>
            <Link to="/super-admin/admins" className="sa-chart-link">View team <FaArrowRight /></Link>
          </div>

          {loading ? (
            <div className="sa-chart-empty">Loading workload data…</div>
          ) : adminClientCounts.length === 0 ? (
            <div className="sa-chart-empty">Add a studio admin to see workload analytics.</div>
          ) : (
            <div className="sa-workload-chart">
              {adminClientCounts
                .slice()
                .sort((a, b) => b.clientCount - a.clientCount)
                .slice(0, 5)
                .map((adm, index) => {
                  const maxClients = Math.max(...adminClientCounts.map((item) => item.clientCount), 1);
                  const width = (adm.clientCount / maxClients) * 100;
                  return (
                    <div className="sa-workload-row" key={adm._id}>
                      <div className="sa-workload-label">
                        <span className="sa-workload-rank">0{index + 1}</span>
                        <span className="sa-workload-name" title={adm.name}>{adm.name || "Studio Admin"}</span>
                        <strong>{adm.clientCount}</strong>
                      </div>
                      <div className="sa-workload-track">
                        <span style={{ width: `${width}%`, animationDelay: `${index * 100}ms` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
          <div className="sa-chart-footer"><span /> Based on currently loaded client assignments</div>
        </div>
      </section>

      {/* Recent Media Preview Grid */}
      <div className="sa-panel bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Recent Media Across All Albums
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Platform-wide photos and videos uploaded by admins and clients
            </p>
          </div>
          <Link
            to="/super-admin/media"
            className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
          >
            Open Media Hub ({mediaList.length}) <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Loading recent media...
          </div>
        ) : mediaList.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            No media uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {mediaList.slice(0, 6).map((item) => (
              <div
                key={item._id}
                onClick={() => navigate("/super-admin/media")}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition"
              >
                {item.videosOrImageUrlType === "Video" ? (
                  <video
                    src={item.videosOrImageUrl}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={item.videosOrImageUrl || item.thumbnail}
                    alt="Album media"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2.5">
                  <span className="text-[10px] text-white font-medium truncate">
                    {item.videosOrImageUrlType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
