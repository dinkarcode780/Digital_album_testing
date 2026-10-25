import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLayerGroup,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategoryByFilter,
  updateSubCategory,
} from "../../app/subcategory/subcategoryThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";

const initialFormState = {
  categoryId: "",
  name: "",
  description: "",
  isActive: true,
};

const SubCategoryPage = () => {
  const dispatch = useDispatch();
  const { subCategories = [], pagination = {}, loading, message, error } =
    useSelector((state) => state.subCategory);
  const { eventCategories = [] } = useSelector((state) => state.eventCategory);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(
      getEventCategoryByFilter({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(categoryFilter ? { categoryId: categoryFilter } : {}),
      ...(statusFilter === "active" ? { isActive: true } : {}),
      ...(statusFilter === "inactive" ? { isActive: false } : {}),
    };

    dispatch(getSubCategoryByFilter(params));
  }, [dispatch, page, limit, search, statusFilter, categoryFilter]);

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

  const resetForm = () => {
    setShowModal(false);
    setEditingSubCategory(null);
    setFormData(initialFormState);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (subcategory) => {
    setEditingSubCategory(subcategory);
    setFormData({
      categoryId: subcategory.categoryId?._id || "",
      name: subcategory.name || "",
      description: subcategory.description || "",
      isActive: subcategory.isActive !== undefined ? subcategory.isActive : true,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Sub category name is required");
      return;
    }

    const payload = {
      categoryId: formData.categoryId,
      name: formData.name.trim(),
      description: formData.description,
      isActive: formData.isActive,
    };

    if (editingSubCategory) {
      payload.subCategoryId = editingSubCategory._id;
      const result = await dispatch(updateSubCategory(payload));
      if (updateSubCategory.fulfilled.match(result)) {
        resetForm();
      }
    } else {
      const result = await dispatch(createSubCategory(payload));
      if (createSubCategory.fulfilled.match(result)) {
        resetForm();
      }
    }
  };

  const handleDelete = async (subcategory) => {
    if (!window.confirm(`Delete ${subcategory.name}?`)) return;

    const result = await dispatch(deleteSubCategory(subcategory._id));
    if (!deleteSubCategory.fulfilled.match(result)) {
      toast.error(result.payload?.message || "Delete failed");
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold">Sub Categories</h1>
          <p className="text-gray-500 mt-2">Manage all event sub categories.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-3"
        >
          <FaPlus />
          Add Sub Category
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search sub category..."
            className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl py-3 px-4 outline-none"
        >
          <option value="">All Categories</option>
          {eventCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-xl py-3 px-4 outline-none"
        >
          <option value="all">All Status</option>
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
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">#</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Sub Category</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Description</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subCategories.length > 0 ? (
              subCategories.map((item, index) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{index + 1}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      <FaLayerGroup />
                      {item.categoryId?.name || "-"}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.isActive === false
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{item.description || "-"}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No sub categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            )
          )}
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
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                {editingSubCategory ? "Edit Sub Category" : "Add Sub Category"}
              </h2>
              <button onClick={resetForm} className="text-gray-500 text-xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select category</option>
                    {eventCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Sub category name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  id="isActive"
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white disabled:opacity-60"
                >
                  {editingSubCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;