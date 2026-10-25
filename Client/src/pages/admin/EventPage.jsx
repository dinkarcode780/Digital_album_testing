import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import CreateEventDialog from "../../components/admindilog/CreateEventDialog";
import {
  createEvent,
  deleteEvent,
  getAllEventByFilter,
  updateEvent,
} from "../../app/event/eventThunk";

const EventPage = () => {
  const dispatch = useDispatch();
  const {
    events = [],
    pagination = {},
    loading,
    message,
    error,
  } = useSelector((state) => state.event);

  const [openCreate, setOpenCreate] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const params = {
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    };
    dispatch(getAllEventByFilter(params));
  }, [dispatch, page, limit, search, statusFilter]);

  useEffect(() => {
    if (message) toast.success(message);
  }, [message]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setOpenCreate(true);
  };

  const openEditModal = (eventItem) => {
    setEditingEvent(eventItem);
    setOpenCreate(true);
  };

  const handleSubmit = async (data) => {
    if (editingEvent) {
      const result = await dispatch(
        updateEvent({ eventId: editingEvent._id, ...data }),
      );
      if (updateEvent.fulfilled.match(result)) {
        setEditingEvent(null);
        setOpenCreate(false);
        setPage(1);
      }
      return;
    }

    const result = await dispatch(createEvent(data));
    if (createEvent.fulfilled.match(result)) {
      setOpenCreate(false);
      setPage(1);
    }
  };

  const handleDelete = async (eventItem) => {
    if (
      !window.confirm(
        `Delete event for ${eventItem.brideName} & ${eventItem.groomName}?`,
      )
    ) {
      return;
    }
    const result = await dispatch(deleteEvent(eventItem._id));
    if (deleteEvent.fulfilled.match(result)) {
      setPage(1);
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-500 mt-2">Manage all events.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-3"
        >
          <FaPlus />
          Create Event
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search Event..."
            className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl px-5 py-3"
        >
          <option value="all">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded-xl px-5 py-3"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Couple</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Start Date</th>
              <th className="text-left p-4">End Date</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Status</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold truncate">
                    {event.groomName} & {event.brideName}
                  </td>
                  <td className="p-4">
                    {event.eventSubCategoryId?.name || "-"}
                  </td>
                  <td className="p-4">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4">
                    {event.eventEndDate
                      ? new Date(event.eventEndDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4">{event.location}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        event.status === "Upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : event.status === "Ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2 whitespace-nowrap">
                      <button className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center flex-shrink-0">
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openEditModal(event)}
                        className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white flex items-center justify-center"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-xl border disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 rounded-xl border ${
                  pageNumber === page
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-xl border disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      <CreateEventDialog
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setEditingEvent(null);
        }}
        onCreate={handleSubmit}
        initialData={editingEvent}
      />
    </div>
  );
};

export default EventPage;
