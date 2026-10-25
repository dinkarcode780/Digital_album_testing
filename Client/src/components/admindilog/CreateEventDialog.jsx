import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { getUserByFilter } from "../../app/auth/authThunk";
import { getSubCategoryByFilter } from "../../app/subcategory/subcategoryThunk";

const CreateEventDialog = ({ open, onClose, onCreate, initialData = null }) => {
  const dispatch = useDispatch();
  const { users = [] } = useSelector((state) => state.auth);
  const { subCategories = [] } = useSelector((state) => state.subCategory);

  const [formData, setFormData] = useState({
    userId: "",
    eventSubCategoryId: "",
    brideName: "",
    groomName: "",
    eventDate: "",
    eventEndDate: "",
    location: "",
    status: "Upcoming",
  });

  useEffect(() => {
    if (open) {
      dispatch(getUserByFilter({ page: 1, limit: 100 }));
      dispatch(getSubCategoryByFilter({ page: 1, limit: 100 }));
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        userId: initialData.userId || "",
        eventSubCategoryId:
          initialData.eventSubCategoryId?._id ||
          initialData.eventSubCategoryId ||
          "",
        brideName: initialData.brideName || "",
        groomName: initialData.groomName || "",
        eventDate: initialData.eventDate
          ? new Date(initialData.eventDate).toISOString().split("T")[0]
          : "",
        eventEndDate: initialData.eventEndDate
          ? new Date(initialData.eventEndDate).toISOString().split("T")[0]
          : "",
        location: initialData.location || "",
        status: initialData.status || "Upcoming",
      });
    } else if (!open) {
      setFormData({
        userId: "",
        eventSubCategoryId: "",
        brideName: "",
        groomName: "",
        eventDate: "",
        eventEndDate: "",
        location: "",
        status: "Upcoming",
      });
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate(formData);

    setFormData({
      userId: "",
      eventSubCategoryId: "",
      brideName: "",
      groomName: "",
      eventDate: "",
      eventEndDate: "",
      location: "",
      status: "Upcoming",
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}

        <div className="flex justify-between items-center border-b p-4 sm:p-6">
          <h2 className="text-2xl font-bold">
            {initialData ? "Update Event" : "Create Event"}
          </h2>

          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">Bride Name</label>

              <input
                type="text"
                name="brideName"
                value={formData.brideName}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Groom Name</label>

              <input
                type="text"
                name="groomName"
                value={formData.groomName}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">Select User</label>

              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.email || "Unnamed User"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold">Event Category</label>

              <select
                name="eventSubCategoryId"
                value={formData.eventSubCategoryId}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              >
                <option value="">Select Category</option>
                {subCategories.map((sc) => (
                  <option key={sc._id} value={sc._id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">Event Date</label>

              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Event End Date</label>

              <input
                type="date"
                name="eventEndDate"
                value={formData.eventEndDate}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold">Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              >
                <option>Upcoming</option>

                <option>Ongoing</option>

                <option>Completed</option>
              </select>
            </div>
          </div>

          {/* Footer */}

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl"
            >
              {initialData ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventDialog;
