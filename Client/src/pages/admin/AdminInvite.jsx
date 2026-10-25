import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { inviteUser } from "../../app/invite/inviteThunk";
import { getAllEventByFilter } from "../../app/event/eventThunk";
import { getAllInviteByFilter } from "../../app/invite/inviteThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";
import { getSubCategoryByFilter } from "../../app/subcategory/subcategoryThunk";

const AdminInvite = () => {
  const { invites, pagination, loading } = useSelector((state) => state.invite);
  const dispatch = useDispatch();

  const { eventCategories } = useSelector((state) => state.eventCategory);

  const { subCategories } = useSelector((state) => state.subCategory);


  const { events } = useSelector((state) => state.event);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [filteredEvents, setFilteredEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [formData, setFormData] = useState({
    eventId: "",
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // if (name === "eventId") {
    //   const event = events.find((item) => item._id === value);
    //   setSelectedEvent(event || null);
    // }
  };

 useEffect(() => {
  dispatch(
    getEventCategoryByFilter({
      page: 1,
      limit: 100,
    })
  );
}, [dispatch]);

  useEffect(() => {
    dispatch(
      getAllInviteByFilter({
        page,
        limit,
        search,
      }),
    );
  }, [dispatch, page, limit, search]);

  //   const handleCategoryChange = (e) => {
  //   const categoryId = e.target.value;

  //   setSelectedCategory(categoryId);

  //   setFormData((prev) => ({
  //     ...prev,
  //     eventId: "",
  //   }));

  //   setSelectedEvent(null);

  //   const data = events.filter(
  //     (item) =>
  //       item.eventSubCategoryId?.categoryId?._id === categoryId
  //   );

  //   setFilteredEvents(data);
  // };
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    setSelectedCategory(categoryId);

    setSelectedSubCategory("");

    setSelectedEvent(null);

    setFormData((prev) => ({
      ...prev,
      eventId: "",
    }));

    dispatch(
      getSubCategoryByFilter({
        categoryId,
        page: 1,
        limit: 100,
      }),
    );
  };

  // When selectedCategory changes (including initial set), fetch subcategories
  useEffect(() => {
    if (!selectedCategory) return;

    dispatch(
      getSubCategoryByFilter({
        categoryId: selectedCategory,
        page: 1,
        limit: 100,
      }),
    );
  }, [dispatch, selectedCategory]);

  // When subCategories list updates, auto-select first subcategory if none selected
  useEffect(() => {
    if (selectedCategory && subCategories?.length > 0 && !selectedSubCategory) {
      const first = subCategories[0];
      if (first) setSelectedSubCategory(first._id);
    }
  }, [subCategories, selectedCategory, selectedSubCategory]);

  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;

    setSelectedSubCategory(subCategoryId);

    setSelectedEvent(null);

    setFormData((prev) => ({
      ...prev,
      eventId: "",
    }));
  };

  // Fetch events whenever selectedSubCategory changes (covers auto-select and manual)
  useEffect(() => {
    if (!selectedSubCategory) return;

    dispatch(
      getAllEventByFilter({
        eventSubCategoryId: selectedSubCategory,
        page: 1,
        limit: 100,
      }),
    );
  }, [dispatch, selectedSubCategory]);

  // No auto-select of event; user will pick from events dropdown populated by getAllEventByFilter
  const handleSubmit = async () => {
    if (!formData.eventId) {
      return toast.error("Please select event");
    }

    if (!formData.name.trim()) {
      return toast.error("Client name is required");
    }

    if (!formData.email && !formData.phoneNumber) {
      return toast.error("Email or Phone Number is required");
    }

    const result = await dispatch(inviteUser(formData));

    if (inviteUser.fulfilled.match(result)) {
      toast.success(result.payload.message);

      setFormData({
        eventId: "",
        name: "",
        email: "",
        phoneNumber: "",
      });
    } else {
      toast.error(result.payload?.message);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Invite Client</h2>

        <div className="grid md:grid-cols-2 gap-5">
          {/* <div>
            <label className="font-medium">Select Event</label>
            <select
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg p-3 outline-none"
            >
              <option value="">Select Event</option>

              {events?.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.eventSubCategoryId?.categoryId?.name} {" "}
                  {event.eventSubCategoryId?.name}
                </option>
              ))}
            </select>
          </div> */}
          <div>
            <label className="font-medium">Category</label>

            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full mt-2 border rounded-lg p-3 outline-none"
            >
              <option value="">Select Category</option>

              {eventCategories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {/* <div>
  <label className="font-medium">
    Sub Category
  </label>

  <input
    type="text"
    readOnly
    value={selectedEvent?.eventSubCategoryId?.name || ""}
    placeholder="Sub Category"
    className="w-full mt-2 border rounded-lg p-3 bg-gray-100 outline-none"
  />
</div> */}

          <div>
            <label className="font-medium">Sub Category</label>

            <select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              disabled={!selectedCategory}
              className="w-full mt-2 border rounded-lg p-3 outline-none disabled:bg-gray-100"
            >
              <option value="">Select Sub Category</option>

              {subCategories?.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium">Bride & Groom</label>

            <select
              name="eventId"
              value={formData.eventId}
              onChange={(e) => {
                const id = e.target.value;
                setFormData((prev) => ({ ...prev, eventId: id }));

                const ev = events?.find((it) => it._id === id) || null;
                setSelectedEvent(ev);
              }}
              disabled={!selectedSubCategory || !events?.length}
              className="w-full mt-2 border rounded-lg p-3 outline-none disabled:bg-gray-100"
            >
              <option value="">Select Event</option>

              {events?.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.brideName} & {event.groomName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Client Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
              className="w-full mt-2 border rounded-lg p-3 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full mt-2 border rounded-lg p-3 outline-none"
            />
          </div>

          <div>
            <label className="font-medium">Phone Number</label>

            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full mt-2 border rounded-lg p-3 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </div>

      {/* Invite List */}

      <div className="bg-white rounded-xl shadow mt-8 p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Invited Clients</h2>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg p-2 w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>

                <th className="p-3 text-left">Event</th>

                <th className="p-3 text-left">Email</th>

                <th className="p-3 text-left">Phone</th>

                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : invites?.length > 0 ? (
                invites.map((invite) => (
                  <tr key={invite._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{invite.name}</td>

                    <td className="p-3">
                      {invite.eventId?.brideName} & {invite.eventId?.groomName}
                    </td>

                    <td className="p-3">{invite.email || "-"}</td>

                    <td className="p-3">{invite.phoneNumber || "-"}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm

            ${
              invite.status === "Accepted"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
                      >
                        {invite.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                          Edit
                        </button>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    No Invite Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows Per Page</span>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPage(1);
                }}
                className="border rounded px-3 py-2"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value="all">All</option>
              </select>
            </div>

            <span>
              Page {pagination?.currentPage || 1} of{" "}
              {pagination?.totalPages || 1}
            </span>

            <div className="flex gap-2">
              <button
                disabled={!pagination?.hasPrevPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={!pagination?.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvite;
