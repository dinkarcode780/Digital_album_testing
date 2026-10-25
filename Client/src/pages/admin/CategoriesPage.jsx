import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaImages,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  createEventCategory,
  deleteEventCategory,
  getEventCategoryByFilter,
  updateEventCategory,
} from "../../app/category/categoryThunk";

const initialFormState = {
  name: "",
  categoryImage: null,
};

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { eventCategories = [], pagination = {}, loading, message, error } =
    useSelector((state) => state.eventCategory);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const params = {
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(statusFilter === "active" ? { isActive: true } : {}),
      ...(statusFilter === "inactive" ? { isActive: false } : {}),
    };

    dispatch(getEventCategoryByFilter(params));
  }, [dispatch, page, limit, search, statusFilter]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const resetModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData(initialFormState);
    setImagePreview("");
  };

  const openCreateModal = () => {
    resetModal();
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      categoryImage: null,
    });
    setImagePreview(category.categoryImage || "");
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, categoryImage: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());

    if (formData.categoryImage) {
      payload.append("categoryImage", formData.categoryImage);
    }

    if (editingCategory) {
      payload.append("eventcategoryId", editingCategory._id);
      const result = await dispatch(updateEventCategory(payload));

      if (updateEventCategory.fulfilled.match(result)) {
        resetModal();
      }
    } else {
      const result = await dispatch(createEventCategory(payload));

      if (createEventCategory.fulfilled.match(result)) {
        resetModal();
      }
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;

    const result = await dispatch(deleteEventCategory(category._id));

    if (!deleteEventCategory.fulfilled.match(result)) {
      toast.error(result.payload?.message || "Delete failed");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="space-y-6 p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage all event categories with search, filters, and pagination.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="relative max-w-md w-full">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search category..."
            className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-xl py-3 px-4 outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded-xl py-3 px-4 outline-none"
          >
            <option value={6}>6 per page</option>
            <option value={8}>8 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {eventCategories.length > 0 ? (
          eventCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl duration-300 overflow-hidden"
            >
              <img
                src={category.categoryImage || category.image || "https://via.placeholder.com/600x400?text=Category"}
                alt={category.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.isActive === false
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {category.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 mt-3">
                  <FaImages />
                  {category.eventsCount || 0} Events
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-xl hover:bg-blue-600 hover:text-white duration-300 flex justify-center items-center gap-2"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-xl hover:bg-red-600 hover:text-white duration-300 flex justify-center items-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed p-10 text-center text-gray-500">
            No categories found.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-3 rounded-xl border disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-4 py-2 rounded-xl border ${
                pageNumber === page ? "bg-purple-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-3 rounded-xl border disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={resetModal} className="text-gray-500 text-xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-xl py-3 px-4"
                />
              </div>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border"
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-60"
                >
                  {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;