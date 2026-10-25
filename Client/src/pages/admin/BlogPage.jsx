import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaUserCircle,
  FaTimes,
  FaSpinner,
  FaThLarge,
  FaList,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaBookOpen,
} from "react-icons/fa";
import {
  getBlogByFilter,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../app/blog/blogThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";

const initialFormState = {
  title: "",
  slug: "",
  category: "Wedding",
  customCategory: "",
  author: "Album Studio",
  description: "",
  content: "",
  isPublished: true,
  image: null,
};

const BlogPage = () => {
  const dispatch = useDispatch();
  const {
    blogs = [],
    pagination = {},
    loading,
    actionLoading,
  } = useSelector((state) => state.blog);

  // Event Categories from categoryThunk & categorySlice
  const { eventCategories = [] } = useSelector(
    (state) => state.eventCategory
  );

  // Current Logged In Admin / Studio
  const { admin } = useSelector((state) => state.admin);
  const loggedInAuthorName = admin?.name?.trim() || "Album Studio";

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'published', 'draft'
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch Event Categories on Mount
  useEffect(() => {
    dispatch(
      getEventCategoryByFilter({ page: 1, limit: 100, isActive: true })
    );
  }, [dispatch]);

  // Dynamic Category List from Event Categories
  const categoryList = useMemo(() => {
    const fromEvent = (eventCategories || [])
      .map((c) => c.name?.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(fromEvent));
    if (unique.length > 0) return unique;
    return [
      "Wedding",
      "Birthday",
      "Engagement",
      "Pre Wedding",
      "Reception",
      "Chhat",
      "Corporate Event",
      "Anniversary",
    ];
  }, [eventCategories]);

  // Fetch blogs on filter changes
  useEffect(() => {
    const params = {
      page,
      limit,
      all: "true", // Tells backend to include drafts for admin
      isAdmin: true,
      sortBy,
      ...(admin?._id ? { adminId: admin._id } : {}),
      ...(searchTerm.trim() ? { search: searchTerm.trim() } : {}),
      ...(selectedCategory !== "all" ? { category: selectedCategory } : {}),
      ...(statusFilter === "published" ? { isPublished: true } : {}),
      ...(statusFilter === "draft" ? { isPublished: false } : {}),
    };

    dispatch(getBlogByFilter(params));
  }, [dispatch, page, limit, searchTerm, selectedCategory, statusFilter, sortBy, admin?._id]);

  // Quick statistics calculation
  const stats = useMemo(() => {
    const total = pagination.totalRecords || blogs.length;
    const publishedCount = blogs.filter((b) => b.isPublished).length;
    const draftCount = blogs.filter((b) => !b.isPublished).length;
    const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
    return { total, publishedCount, draftCount, totalViews };
  }, [blogs, pagination.totalRecords]);

  // Modal Handlers
  const openCreateModal = () => {
    setEditingBlog(null);
    const defaultCat = categoryList[0] || "Wedding";
    setFormData({
      ...initialFormState,
      category: defaultCat,
      author: loggedInAuthorName,
    });
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    const isPreset = categoryList.includes(blog.category);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      category: isPreset
        ? blog.category
        : blog.category
        ? "Other"
        : categoryList[0] || "Wedding",
      customCategory: isPreset ? "" : blog.category || "",
      author: blog.author || loggedInAuthorName,
      description: blog.description || "",
      content: blog.content || "",
      isPublished: blog.isPublished ?? true,
      image: null,
    });
    setImagePreview(blog.image || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData(initialFormState);
    setImagePreview("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory.trim()
        : formData.category;

    if (!finalCategory) {
      toast.error("Blog category is required");
      return;
    }

    if (!editingBlog && !formData.image) {
      toast.error("Blog cover image is required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    if (formData.slug.trim()) data.append("slug", formData.slug.trim());
    data.append("category", finalCategory);
    data.append("author", formData.author.trim() || loggedInAuthorName);
    data.append("description", formData.description.trim());
    data.append("content", formData.content);
    data.append("isPublished", formData.isPublished);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (editingBlog) {
      data.append("blogId", editingBlog._id);
      const result = await dispatch(updateBlog(data));
      if (updateBlog.fulfilled.match(result)) {
        toast.success("Blog updated successfully!");
        closeModal();
      } else {
        toast.error(result.payload?.message || "Failed to update blog");
      }
    } else {
      const result = await dispatch(createBlog(data));
      if (createBlog.fulfilled.match(result)) {
        toast.success("Blog created successfully!");
        closeModal();
      } else {
        toast.error(result.payload?.message || "Failed to create blog");
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const result = await dispatch(deleteBlog(deleteTarget._id));
    if (deleteBlog.fulfilled.match(result)) {
      toast.success("Blog deleted successfully!");
      setDeleteTarget(null);
    } else {
      toast.error(result.payload?.message || "Failed to delete blog");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "N/A"
      : d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <div className="space-y-8 p-3 md:p-6 max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Blog Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Publish stories, photography tips, and wedding inspiration for your studio.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition font-semibold"
        >
          <FaPlus />
          Write New Story
        </button>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <FaBookOpen />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Stories
            </p>
            <p className="text-2xl font-black text-gray-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Published
            </p>
            <p className="text-2xl font-black text-gray-800">
              {stats.publishedCount}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <FaClock />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Drafts
            </p>
            <p className="text-2xl font-black text-gray-800">
              {stats.draftCount}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <FaChartLine />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Views
            </p>
            <p className="text-2xl font-black text-gray-800">
              {stats.totalViews}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTROLS & FILTERS ================= */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="latest">Newest First</option>
              <option value="popular">Most Views</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg text-sm transition ${
                  viewMode === "grid"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Grid View"
              >
                <FaThLarge />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg text-sm transition ${
                  viewMode === "table"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Table View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT LISTING ================= */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FaSpinner className="text-4xl text-purple-600 animate-spin" />
          <p className="text-gray-500 mt-4 text-sm font-semibold">
            Loading stories...
          </p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center text-2xl mb-4">
            <FaBookOpen />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            No Stories Found
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            {searchTerm || selectedCategory !== "all" || statusFilter !== "all"
              ? "No blogs match the selected search or filter criteria. Try resetting your filters."
              : "You haven't written any blog articles yet. Click the button below to get started!"}
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
          >
            <FaPlus />
            Create First Story
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ================= GRID VIEW ================= */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                <img
                  src={
                    blog.image ||
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600"
                  }
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-purple-700 font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  {blog.category}
                </span>
                <span
                  className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                    blog.isPublished
                      ? "bg-green-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {blog.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <FaUserCircle />
                      {blog.author || "Album Studio"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                  </div>

                  <Link
                    to={`/admin/blogs/${blog._id}`}
                    className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition line-clamp-2 leading-snug"
                  >
                    {blog.title}
                  </Link>

                  <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {blog.description ||
                      (blog.content
                        ? blog.content.substring(0, 100) + "..."
                        : "No summary provided.")}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                    <FaEye className="text-purple-500" />
                    {blog.views || 0} views
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/blogs/${blog._id}`}
                      className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition"
                      title="View Details"
                    >
                      <FaEye />
                    </Link>

                    <button
                      type="button"
                      onClick={() => openEditModal(blog)}
                      className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition"
                      title="Edit Story"
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(blog)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                      title="Delete Story"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-6">Story</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Views</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-purple-50/30 transition group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            blog.image ||
                            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=120"
                          }
                          alt={blog.title}
                          className="w-14 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/admin/blogs/${blog._id}`}
                            className="font-bold text-gray-900 group-hover:text-purple-600 transition block truncate"
                          >
                            {blog.title}
                          </Link>
                          <span className="text-xs text-gray-400 block truncate">
                            /{blog.slug || blog._id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-purple-100 text-purple-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {blog.author || "Album Studio"}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {blog.views || 0}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          blog.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/blogs/${blog._id}`}
                          className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(blog)}
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(blog)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing Page{" "}
            <span className="font-bold text-gray-800">
              {pagination.currentPage}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-800">
              {pagination.totalPages}
            </span>{" "}
            ({pagination.totalRecords} total stories)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition ${
                    p === pagination.currentPage
                      ? "bg-purple-600 text-white shadow-md"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ================= CREATE / EDIT MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  {editingBlog ? "Edit Blog Story" : "Create New Story"}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {editingBlog
                    ? "Update story details and publication settings."
                    : "Fill in the details to publish a new article."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Top 10 Wedding Photography Poses for Couples"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>

              {/* Slug (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Slug / URL Keyword (Optional)
                </label>
                <input
                  type="text"
                  name="slug"
                  placeholder="e.g. top-10-wedding-photography-poses"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>

              {/* Category & Author */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm font-semibold"
                  >
                    {categoryList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Other (Custom Category)</option>
                  </select>

                  {formData.category === "Other" && (
                    <input
                      type="text"
                      name="customCategory"
                      placeholder="Enter custom category"
                      value={formData.customCategory}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    placeholder={`e.g. ${loggedInAuthorName}`}
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Cover Image {editingBlog ? "(Leave empty to keep current)" : "*"}
                </label>

                <div className="relative border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-2xl p-4 text-center cursor-pointer transition bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-44 object-cover rounded-xl shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="py-6">
                      <FaCloudUploadAlt className="text-4xl text-purple-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-700">
                        Upload Blog Cover Image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Short Summary / Excerpt
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="A short punchy intro that appears on blog cards..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Full Article Content
                </label>
                <textarea
                  name="content"
                  rows={6}
                  placeholder="Write the complete story, tips, gear recommendations, and photoshoot details..."
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm leading-relaxed"
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label
                  htmlFor="isPublished"
                  className="text-sm font-bold text-gray-700 cursor-pointer select-none"
                >
                  Publish immediately (Visible to website users)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading && <FaSpinner className="animate-spin" />}
                  {editingBlog ? "Save Changes" : "Publish Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center text-2xl mb-4">
              <FaTrash />
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              Delete Story?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-800">
                "{deleteTarget.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading && <FaSpinner className="animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;