// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";

// import EditUserDialog from "../../components/admindilog/EditUserDialog";
// import UserStatusDialog from "../../components/admindilog/UserStatusDialog";
// import DeleteUserDialog from "../../components/admindilog/DeleteUserDialog";
// import AddUserDialog from "../../components/admindilog/AddUserDilog";
// import Pagination from "../../components/common/Pagination";

// import {
//   getUserByFilter,
//   toggleUserStatus,
//   userDeleteById,
//   userRegister,
//   userUpdateProfile,
// } from "../../app/auth/authThunk";

// import {
//   FaSearch,
//   FaEye,
//   FaEdit,
//   FaTrash,
//   FaUserCheck,
//   FaUserSlash,
//   FaPlus,
// } from "react-icons/fa";

// const UsersPage = () => {
//   const dispatch = useDispatch();

//   const {
//     users,
//     loading,
//     error,
//     totalPages,
//     currentPage,
//     totalUsers,
//   } = useSelector((state) => state.auth);

//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openStatus, setOpenStatus] = useState(false);

//   const [selectedUser, setSelectedUser] = useState(null);

//   const [search, setSearch] = useState("");
//   const [role, setRole] = useState("");
//   const [status, setStatus] = useState("");

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   useEffect(() => {
//     const params = {
//       page,
//       limit,
//     };

//     if (search) params.search = search;
//     if (role) params.userType = role;
//     if (status) params.isActive = status;

//     dispatch(getUserByFilter(params));
//   }, [dispatch, page, limit, search, role, status]);

//   const buildParams = (nextPage = page) => {
//     const params = {
//       page: nextPage,
//       limit,
//     };

//     if (search) params.search = search;
//     if (role) params.userType = role;
//     if (status) params.isActive = status;

//     return params;
//   };

//   // ================= Update =================

//   const handleUpdate = async (updatedUser) => {
//     const result = await dispatch(
//       userUpdateProfile({
//         userId: selectedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phoneNumber: updatedUser.phoneNumber,
//         address: updatedUser.address,
//         profileImage: updatedUser.profileImage,
//       })
//     );

//     if (userUpdateProfile.fulfilled.match(result)) {
//       toast.success("User updated successfully");
//       dispatch(getUserByFilter(buildParams(page)));
//       setOpenEdit(false);
//     }
//   };

//   // ================= Delete =================

//   const handleDelete = async (user) => {
//     if (!user?._id) return;

//     const result = await dispatch(userDeleteById(user._id));

//     if (userDeleteById.fulfilled.match(result)) {
//       toast.success("User deleted successfully");
//       dispatch(getUserByFilter(buildParams(page)));
//       setOpenDelete(false);
//     }
//   };

//   // ================= Status =================

//   const handleStatus = async () => {
//     const result = await dispatch(toggleUserStatus(selectedUser._id));

//     if (toggleUserStatus.fulfilled.match(result)) {
//       toast.success(result.payload.message);
//       dispatch(getUserByFilter(buildParams(page)));
//       setOpenStatus(false);
//     } else {
//       toast.error(result.payload?.message);
//     }
//   };

//   // ================= Add User =================

//   const handleAddUser = async (userData) => {
//     const result = await dispatch(userRegister(userData));

//     if (userRegister.fulfilled.match(result)) {
//       toast.success("User Added Successfully");
//       dispatch(getUserByFilter(buildParams(page)));
//       setOpenAdd(false);
//     }
//   };

//   return (
//     <div className="space-y-6">

//       {/* ================= Dialogs ================= */}

//       <EditUserDialog
//         open={openEdit}
//         user={selectedUser}
//         onClose={() => setOpenEdit(false)}
//         onSave={handleUpdate}
//       />

//       <AddUserDialog
//         open={openAdd}
//         onClose={() => setOpenAdd(false)}
//         onSave={handleAddUser}
//       />

//       <DeleteUserDialog
//         open={openDelete}
//         user={selectedUser}
//         onClose={() => setOpenDelete(false)}
//         onDelete={handleDelete}
//       />

//       <UserStatusDialog
//         open={openStatus}
//         user={selectedUser}
//         onClose={() => setOpenStatus(false)}
//         onConfirm={handleStatus}
//       />

//       {/* ================= Heading ================= */}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             Users Management
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Manage all registered users.
//           </p>
//         </div>

//         <button
//           onClick={() => setOpenAdd(true)}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
//         >
//           <FaPlus />
//           Add User
//         </button>

//       </div>

//       {/* ================= Search ================= */}

//       <div className="bg-white rounded-2xl shadow-sm p-4">

//         <div className="flex flex-col lg:flex-row gap-4">

//           <div className="relative flex-1">

//             <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

//             <input
//               type="text"
//               placeholder="Search by name, email or phone..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
//             />

//           </div>

//           <select
//             value={role}
//             onChange={(e) => {
//               setRole(e.target.value);
//               setPage(1);
//             }}
//             className="border rounded-xl px-4 py-3"
//           >
//             <option value="">All Roles</option>
//             <option value="Admin">Admin</option>
//             <option value="User">User</option>
//           </select>

//           <select
//             value={status}
//             onChange={(e) => {
//               setStatus(e.target.value);
//               setPage(1);
//             }}
//             className="border rounded-xl px-4 py-3"
//           >
//             <option value="">All Status</option>
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>

//         </div>

//       </div>

//       {/* ================= Top Info ================= */}

//       <div className="flex flex-col md:flex-row justify-between items-center gap-3">

//         <p className="text-sm text-gray-500">
//           Showing <span className="font-semibold">{users.length}</span> of{" "}
//           <span className="font-semibold">{totalUsers}</span> users
//         </p>

//         <div className="flex items-center gap-2">

//           <span className="text-sm text-gray-600">
//             Rows :
//           </span>

//           <select
//             value={limit}
//             onChange={(e) => {
//               const value =
//                 e.target.value === "All"
//                   ? totalUsers
//                   : Number(e.target.value);

//               setLimit(value);
//               setPage(1);
//             }}
//             className="border rounded-lg px-3 py-2"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//             <option value="All">All</option>
//           </select>

//         </div>

//       </div>
//       <div className="bg-white rounded-2xl shadow overflow-hidden">
//         <div className="overflow-x-auto hide-scrollbar">
//           <table className="min-w-[1050px] w-full">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="px-4 py-4 text-left font-semibold text-gray-700 w-20">
//                   ID
//                 </th>

//                 <th className="px-4 py-4 text-left font-semibold text-gray-700 min-w-[240px]">
//                   User
//                 </th>

//                 <th className="px-4 py-4 text-left font-semibold text-gray-700 min-w-[260px]">
//                   Email
//                 </th>

//                 <th className="px-4 py-4 text-left font-semibold text-gray-700 min-w-[150px]">
//                   Phone
//                 </th>

//                 <th className="px-4 py-4 text-left font-semibold text-gray-700 min-w-[120px]">
//                   Role
//                 </th>

//                 <th className="px-4 py-4 text-left font-semibold text-gray-700 min-w-[120px]">
//                   Status
//                 </th>

//                 <th className="px-4 py-4 text-center font-semibold text-gray-700 min-w-[220px]">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="text-center py-16 text-gray-500"
//                   >
//                     Loading Users...
//                   </td>
//                 </tr>
//               ) : users?.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="text-center py-16 text-gray-500"
//                   >
//                     No Users Found.
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user, index) => (
//                   <tr
//                     key={user._id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     {/* Serial Number */}

//                     <td className="px-4 py-5 font-semibold text-gray-700 whitespace-nowrap align-middle">
//                       {(page - 1) * limit + index + 1}
//                     </td>

//                     {/* User */}

//                     <td className="px-4 py-5 align-middle">
//                       <Link to={`/admin/users/details/${user._id}`} className="flex items-center gap-3 min-w-[220px]">
//                         <img
//                           src={
//                             user.profileImage ||
//                             "https://i.pravatar.cc/150?img=11"
//                           }
//                           alt={user.name}
//                           className="w-12 h-12 rounded-full object-cover flex-shrink-0"
//                         />

//                         <div>
//                           <h3 className="font-semibold text-gray-800">
//                             {user.name}
//                           </h3>

//                           {/* <p className="text-xs text-gray-500">
//                             #{user._id.slice(-6)}
//                           </p> */}
//                         </div>
//                       </Link>
//                     </td>

//                     {/* Email */}

//                     <td className="px-4 py-5 whitespace-nowrap align-middle">
//                       {user.email || "N/A"}
//                     </td>

//                     {/* Phone */}

//                     <td className="px-4 py-5 whitespace-nowrap align-middle">
//                       {user.phoneNumber || "N/A"}
//                     </td>

//                     {/* Role */}

//                     <td className="px-4 py-5 align-middle">
//                       <span
//                         className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${
//                           user.userType === "Admin"
//                             ? "bg-purple-100 text-purple-700"
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                       >
//                         {user.userType}
//                       </span>
//                     </td>

//                     {/* Status */}

//                     <td className="px-4 py-5 align-middle">
//                       <span
//                         className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${
//                           user.isActive
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {user.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>

//                     {/* Actions */}

//                     <td className="px-4 py-5 align-middle">
//                       <div className="flex items-center justify-center gap-2 whitespace-nowrap">
//                         <Link
//                           to={`/admin/users/details/${user._id}`}
//                           className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
//                         >
//                           <FaEye />
//                         </Link>

//                         <button
//                           onClick={() => {
//                             setSelectedUser(user);
//                             setOpenEdit(true);
//                           }}
//                           className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white flex items-center justify-center transition"
//                         >
//                           <FaEdit />
//                         </button>

//                         <button
//                           onClick={() => {
//                             setSelectedUser(user);
//                             setOpenDelete(true);
//                           }}
//                           className="w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition"
//                         >
//                           <FaTrash />
//                         </button>

//                         {user.isActive ? (
//                           <button
//                             onClick={() => {
//                               setSelectedUser(user);
//                               setOpenStatus(true);
//                             }}
//                             className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white flex items-center justify-center transition"
//                           >
//                             <FaUserSlash />
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => {
//                               setSelectedUser(user);
//                               setOpenStatus(true);
//                             }}
//                             className="w-10 h-10 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition"
//                           >
//                             <FaUserCheck />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Error */}

//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
//           {error}
//         </div>
//       )}

//       {/* Pagination */}

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setPage}
//       />
//     </div>
//   );
// };

// export default UsersPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import EditUserDialog from "../../components/admindilog/EditUserDialog";
import UserStatusDialog from "../../components/admindilog/UserStatusDialog";
import DeleteUserDialog from "../../components/admindilog/DeleteUserDialog";
import AddUserDialog from "../../components/admindilog/AddUserDilog";
import Pagination from "../../components/common/Pagination";

import {
  getUserByFilter,
  toggleUserStatus,
  userDeleteById,
  userRegister,
  userUpdateProfile,
} from "../../app/auth/authThunk";

import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaUserSlash,
  FaPlus,
  FaUsers,
  FaUserShield,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaArrowRight,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const UsersPage = () => {
  const dispatch = useDispatch();

  const {
    users,
    loading,
    error,
    totalPages,
    currentPage,
    totalUsers,
  } = useSelector((state) => state.auth);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const params = {
      page,
      limit,
    };

    if (search) params.search = search;
    if (role) params.userType = role;
    if (status) params.isActive = status;

    dispatch(getUserByFilter(params));
  }, [dispatch, page, limit, search, role, status]);

  const buildParams = (nextPage = page) => {
    const params = {
      page: nextPage,
      limit,
    };

    if (search) params.search = search;
    if (role) params.userType = role;
    if (status) params.isActive = status;

    return params;
  };

  // ================= UPDATE =================

  const handleUpdate = async (updatedUser) => {
    const result = await dispatch(
      userUpdateProfile({
        userId: selectedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
      })
    );

    if (userUpdateProfile.fulfilled.match(result)) {
      toast.success("User updated successfully");

      dispatch(getUserByFilter(buildParams(page)));

      setOpenEdit(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (user) => {
    if (!user?._id) return;

    const result = await dispatch(userDeleteById(user._id));

    if (userDeleteById.fulfilled.match(result)) {
      toast.success("User deleted successfully");

      dispatch(getUserByFilter(buildParams(page)));

      setOpenDelete(false);
    }
  };

  // ================= STATUS =================

  const handleStatus = async () => {
    const result = await dispatch(toggleUserStatus(selectedUser._id));

    if (toggleUserStatus.fulfilled.match(result)) {
      toast.success(result.payload.message);

      dispatch(getUserByFilter(buildParams(page)));

      setOpenStatus(false);
    } else {
      toast.error(result.payload?.message);
    }
  };

  // ================= ADD USER =================

  const handleAddUser = async (userData) => {
    const result = await dispatch(userRegister(userData));

    if (userRegister.fulfilled.match(result)) {
      toast.success("User Added Successfully");

      dispatch(getUserByFilter(buildParams(page)));

      setOpenAdd(false);
    }
  };

  // ================= COUNTS =================

  const activeUsers =
    users?.filter((user) => user.isActive)?.length || 0;

  const inactiveUsers =
    users?.filter((user) => !user.isActive)?.length || 0;

  const adminUsers =
    users?.filter((user) => user.userType === "Admin")?.length || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#faf8ff] via-[#f6f1ff] to-[#eee8ff]">

      {/* =====================================================
          BACKGROUND ANIMATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-purple-300/20 blur-[120px] animate-pulse" />

      <div
        className="pointer-events-none absolute -right-40 top-[20%] h-[450px] w-[450px] rounded-full bg-violet-300/20 blur-[120px]"
        style={{
          animation: "usersBlob 10s ease-in-out infinite",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-[-150px] left-[35%] h-[400px] w-[400px] rounded-full bg-fuchsia-300/15 blur-[110px]"
        style={{
          animation: "usersBlob 12s ease-in-out infinite reverse",
        }}
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 space-y-7">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-purple-600">

              <FaUsers />

              Studio Users

            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">

              Users{" "}

              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Management
              </span>

            </h1>

            <p className="mt-2 text-gray-500">
              Manage registered users, accounts and access permissions.
            </p>

          </div>


          <button
            onClick={() => setOpenAdd(true)}
            className="
              group
              relative
              flex
              items-center
              justify-center
              gap-3
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              via-violet-600
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

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative flex items-center gap-2">

              <FaPlus />

              Add User

              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />

            </span>

          </button>

        </div>


        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-gray-800">
                  {totalUsers || 0}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform duration-300 group-hover:scale-110">

                <FaUsers />

              </div>

            </div>

          </div>


          {/* ACTIVE */}

          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Active
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-green-600">
                  {activeUsers}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-transform duration-300 group-hover:scale-110">

                <FaCheckCircle />

              </div>

            </div>

          </div>


          {/* INACTIVE */}

          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Inactive
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-red-500">
                  {inactiveUsers}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500 transition-transform duration-300 group-hover:scale-110">

                <FaTimesCircle />

              </div>

            </div>

          </div>


          {/* ADMINS */}

          <div className="group rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Admin Users
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-violet-600">
                  {adminUsers}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition-transform duration-300 group-hover:scale-110">

                <FaUserShield />

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            FILTER CARD
        ====================================================== */}

        <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(124,58,237,0.08)] backdrop-blur-2xl">

          <div className="mb-4 flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">

              <FaFilter />

            </div>

            <div>

              <h2 className="font-bold text-gray-800">
                Search & Filters
              </h2>

              <p className="text-xs text-gray-500">
                Find users quickly
              </p>

            </div>

          </div>


          <div className="flex flex-col gap-4 lg:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="
                  w-full
                  rounded-xl
                  border
                  border-purple-100
                  bg-white/80
                  py-3.5
                  pl-11
                  pr-4
                  text-gray-700
                  outline-none
                  transition-all
                  duration-300
                  hover:border-purple-200
                  focus:border-purple-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

            </div>


            {/* ROLE */}

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="
                rounded-xl
                border
                border-purple-100
                bg-white/80
                px-5
                py-3.5
                font-medium
                text-gray-600
                outline-none
                transition
                hover:border-purple-200
                focus:border-purple-400
                focus:ring-4
                focus:ring-purple-100
              "
            >

              <option value="">
                All Roles
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="User">
                User
              </option>

            </select>


            {/* STATUS */}

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="
                rounded-xl
                border
                border-purple-100
                bg-white/80
                px-5
                py-3.5
                font-medium
                text-gray-600
                outline-none
                transition
                hover:border-purple-200
                focus:border-purple-400
                focus:ring-4
                focus:ring-purple-100
              "
            >

              <option value="">
                All Status
              </option>

              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>

            </select>

          </div>

        </div>


        {/* =====================================================
            TOP INFO
        ====================================================== */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="rounded-full border border-purple-100 bg-white/60 px-4 py-2 text-sm text-gray-500 backdrop-blur-md">

            Showing{" "}

            <span className="font-bold text-purple-600">
              {users?.length || 0}
            </span>

            {" "}of{" "}

            <span className="font-bold text-gray-700">
              {totalUsers || 0}
            </span>

            {" "}users

          </div>


          <div className="flex items-center gap-2">

            <span className="text-sm font-medium text-gray-500">
              Rows
            </span>

            <select
              value={limit}
              onChange={(e) => {
                const value =
                  e.target.value === "All"
                    ? totalUsers
                    : Number(e.target.value);

                setLimit(value);
                setPage(1);
              }}
              className="rounded-xl border border-purple-100 bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-300"
            >

              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="All">All</option>

            </select>

          </div>

        </div>


        {/* =====================================================
            TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/70 shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-2xl">

          <div className="overflow-x-auto">

            <table className="min-w-[1100px] w-full">

              {/* HEADER */}

              <thead>

                <tr className="border-b border-purple-100 bg-gradient-to-r from-purple-50/90 via-white/70 to-violet-50/90">

                  <th className="px-5 py-5 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    ID
                  </th>

                  <th className="px-5 py-5 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-5 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    Contact
                  </th>

                  <th className="px-5 py-5 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    Role
                  </th>

                  <th className="px-5 py-5 text-left text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-5 text-center text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>


              {/* BODY */}

              <tbody>

                {loading ? (

                  <tr>

                    <td colSpan={6} className="py-20">

                      <div className="flex flex-col items-center justify-center">

                        <div className="relative h-14 w-14">

                          <div className="absolute inset-0 rounded-full border-4 border-purple-100" />

                          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-purple-600" />

                        </div>

                        <p className="mt-4 font-semibold text-gray-500">
                          Loading users...
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : users?.length === 0 ? (

                  <tr>

                    <td colSpan={6} className="py-20 text-center">

                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-2xl text-purple-500">

                        <FaUsers />

                      </div>

                      <h3 className="mt-4 font-bold text-gray-700">
                        No Users Found
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>

                ) : (

                  users.map((user, index) => (

                    <tr
                      key={user._id}
                      className="
                        group
                        border-b
                        border-gray-100
                        transition-all
                        duration-300
                        hover:bg-purple-50/50
                      "
                    >

                      {/* ID */}

                      <td className="px-5 py-5 align-middle">

                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-500 transition group-hover:bg-purple-100 group-hover:text-purple-600">

                          {(page - 1) * limit + index + 1}

                        </span>

                      </td>


                      {/* USER */}

                      <td className="px-5 py-5 align-middle">

                        <Link
                          to={`/admin/users/details/${user._id}`}
                          className="flex min-w-[230px] items-center gap-3"
                        >

                          <div className="relative flex-shrink-0">

                            <img
                              src={
                                user.profileImage ||
                                "https://i.pravatar.cc/150?img=11"
                              }
                              alt={user.name}
                              className="
                                h-12
                                w-12
                                rounded-xl
                                border-2
                                border-white
                                object-cover
                                shadow-sm
                                transition-all
                                duration-300
                                group-hover:scale-105
                                group-hover:shadow-md
                              "
                            />

                            <span
                              className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                                user.isActive
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />

                          </div>


                          <div>

                            <h3 className="font-bold text-gray-800 transition-colors group-hover:text-purple-700">

                              {user.name || "Unnamed User"}

                            </h3>

                            <p className="mt-0.5 text-xs text-gray-400">
                              View profile
                            </p>

                          </div>

                        </Link>

                      </td>


                      {/* CONTACT */}

                      <td className="px-5 py-5 align-middle">

                        <div className="space-y-1.5">

                          <div className="flex items-center gap-2 text-sm text-gray-600">

                            <FaEnvelope className="text-xs text-purple-400" />

                            <span className="max-w-[230px] truncate">
                              {user.email || "N/A"}
                            </span>

                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-400">

                            <FaPhoneAlt className="text-xs text-purple-400" />

                            {user.phoneNumber || "N/A"}

                          </div>

                        </div>

                      </td>


                      {/* ROLE */}

                      <td className="px-5 py-5 align-middle">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ${
                            user.userType === "Admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >

                          {user.userType === "Admin" ? (
                            <FaUserShield />
                          ) : (
                            <FaUser />
                          )}

                          {user.userType || "User"}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-5 align-middle">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.isActive
                                ? "animate-pulse bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          {user.isActive ? "Active" : "Inactive"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center justify-center gap-2">

                          {/* VIEW */}

                          <Link
                            to={`/admin/users/details/${user._id}`}
                            title="View User"
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-50
                              text-blue-600
                              transition-all
                              duration-300
                              hover:-translate-y-1
                              hover:bg-blue-600
                              hover:text-white
                              hover:shadow-lg
                            "
                          >

                            <FaEye />

                          </Link>


                          {/* EDIT */}

                          <button
                            title="Edit User"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenEdit(true);
                            }}
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-yellow-50
                              text-yellow-600
                              transition-all
                              duration-300
                              hover:-translate-y-1
                              hover:bg-yellow-500
                              hover:text-white
                              hover:shadow-lg
                            "
                          >

                            <FaEdit />

                          </button>


                          {/* DELETE */}

                          <button
                            title="Delete User"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenDelete(true);
                            }}
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              bg-red-50
                              text-red-500
                              transition-all
                              duration-300
                              hover:-translate-y-1
                              hover:bg-red-600
                              hover:text-white
                              hover:shadow-lg
                            "
                          >

                            <FaTrash />

                          </button>


                          {/* STATUS */}

                          {user.isActive ? (

                            <button
                              title="Deactivate User"
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenStatus(true);
                              }}
                              className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-orange-50
                                text-orange-500
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:bg-orange-500
                                hover:text-white
                                hover:shadow-lg
                              "
                            >

                              <FaUserSlash />

                            </button>

                          ) : (

                            <button
                              title="Activate User"
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenStatus(true);
                              }}
                              className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-50
                                text-green-600
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:bg-green-600
                                hover:text-white
                                hover:shadow-lg
                              "
                            >

                              <FaUserCheck />

                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (

          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">

            <FaTimesCircle />

            {error}

          </div>

        )}


        {/* =====================================================
            PAGINATION
        ====================================================== */}

        <div className="pb-6">

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />

        </div>


        {/* =====================================================
            DIALOGS
        ====================================================== */}

        <EditUserDialog
          open={openEdit}
          user={selectedUser}
          onClose={() => setOpenEdit(false)}
          onSave={handleUpdate}
        />

        <AddUserDialog
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onSave={handleAddUser}
        />

        <DeleteUserDialog
          open={openDelete}
          user={selectedUser}
          onClose={() => setOpenDelete(false)}
          onDelete={handleDelete}
        />

        <UserStatusDialog
          open={openStatus}
          user={selectedUser}
          onClose={() => setOpenStatus(false)}
          onConfirm={handleStatus}
        />

      </div>


      {/* =====================================================
          ANIMATION
      ====================================================== */}

      <style>{`

        @keyframes usersBlob {

          0% {
            transform: translate(0px, 0px);
          }

          50% {
            transform: translate(-25px, -25px);
          }

          100% {
            transform: translate(0px, 0px);
          }

        }

      `}</style>

    </div>
  );
};

export default UsersPage;

