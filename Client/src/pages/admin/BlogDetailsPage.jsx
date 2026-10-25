import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaTags,
  FaEye,
  FaClock,
  FaFileAlt,
  FaSpinner,
  FaCloudUploadAlt,
  FaTimes,
  FaLayerGroup,
} from "react-icons/fa";
import {
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../../app/blog/blogThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";
import { clearBlogDetail } from "../../app/blog/blogSlice";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { blog, detailLoading, actionLoading } = useSelector(
    (state) => state.blog
  );

  const { eventCategories = [] } = useSelector(
    (state) => state.eventCategory
  );

  const { admin } = useSelector((state) => state.admin);
  const loggedInAuthorName = admin?.name?.trim() || "Album Studio";

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Wedding",
    author: "",
    description: "",
    content: "",
    isPublished: true,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Dynamic Category List from Event Categories
  const categoryList = React.useMemo(() => {
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      dispatch(
        getBlogById({ blogId: id, includeUnpublished: true, isAdmin: true })
      );
    }
    // Fetch Event Categories
    dispatch(
      getEventCategoryByFilter({ page: 1, limit: 100, isActive: true })
    );

    return () => {
      dispatch(clearBlogDetail());
    };
  }, [dispatch, id]);

  const openEditModal = () => {
    if (!blog) return;
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || categoryList[0] || "Wedding",
      author: blog.author || loggedInAuthorName,
      description: blog.description || "",
      content: blog.content || "",
      isPublished: blog.isPublished ?? true,
      image: null,
    });
    setImagePreview(blog.image || "");
    setShowEditModal(true);
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    const data = new FormData();
    data.append("blogId", blog._id);
    data.append("title", formData.title.trim());
    if (formData.slug.trim()) data.append("slug", formData.slug.trim());
    data.append("category", formData.category);
    data.append("author", formData.author.trim() || loggedInAuthorName);
    data.append("description", formData.description.trim());
    data.append("content", formData.content);
    data.append("isPublished", formData.isPublished);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const result = await dispatch(updateBlog(data));
    if (updateBlog.fulfilled.match(result)) {
      toast.success("Blog updated successfully!");
      setShowEditModal(false);
      // Refresh current blog details
      dispatch(getBlogById({ blogId: id, includeUnpublished: true }));
    } else {
      toast.error(result.payload?.message || "Failed to update blog");
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    const result = await dispatch(deleteBlog(blog._id));
    if (deleteBlog.fulfilled.match(result)) {
      toast.success("Blog deleted successfully!");
      navigate("/admin/blogs");
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
          month: "long",
          year: "numeric",
        });
  };

  // Word count & reading time
  const readingTime = blog?.content
    ? Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 180))
    : 1;
  const wordCount = blog?.content
    ? blog.content.split(/\s+/).filter(Boolean).length
    : 0;

  if (detailLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="text-4xl text-purple-600 animate-spin" />
        <p className="text-gray-500 mt-4 text-sm font-semibold">
          Loading story details...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Story Not Found
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          The requested article does not exist or may have been deleted.
        </p>
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
        >
          <FaArrowLeft /> Back to Blogs List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-3 md:p-6 max-w-7xl mx-auto">
      {/* ================= BREADCRUMB & TOP ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1">
            <Link to="/admin/dashboard" className="hover:text-purple-600 transition">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/admin/blogs" className="hover:text-purple-600 transition">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-xs">{blog.title}</span>
          </div>

          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition"
          >
            <FaArrowLeft /> Back to All Stories
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            to={`/blog/${blog._id}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <FaExternalLinkAlt />
            View Public Post
          </Link>

          <button
            type="button"
            onClick={openEditModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <FaEdit />
            Edit Story
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>

      {/* ================= HERO COVER BANNER ================= */}
      <div className="relative rounded-3xl overflow-hidden shadow-md h-72 md:h-96 bg-gray-900">
        <img
          src={
            blog.image ||
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400"
          }
          alt={blog.title}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="absolute top-5 left-5 flex items-center gap-2">
          <span className="bg-white/90 backdrop-blur-md text-purple-700 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md">
            {blog.category}
          </span>
          <span
            className={`text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md ${
              blog.isPublished
                ? "bg-green-500 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {blog.isPublished ? "Published" : "Draft Mode"}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-2xl md:text-4xl font-black leading-tight drop-shadow-md">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 mt-3 text-xs text-gray-200 font-medium">
            <span className="flex items-center gap-1.5">
              <FaUserCircle className="text-purple-300" />
              {blog.author || "Album Studio"}
            </span>
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-purple-300" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <FaEye className="text-purple-300" />
              {blog.views || 0} Total Views
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT + METADATA SIDEBAR ================= */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Excerpt / Summary */}
          {blog.description && (
            <div className="bg-purple-50 border-l-4 border-purple-600 rounded-r-2xl p-5 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 mb-1">
                Story Excerpt
              </h4>
              <p className="text-gray-700 text-base leading-relaxed font-medium">
                {blog.description}
              </p>
            </div>
          )}

          {/* Full Article Content */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
              <FaFileAlt className="text-purple-600" />
              Full Article Story
            </h3>

            <div className="text-gray-700 text-base leading-8 whitespace-pre-line space-y-4">
              {blog.content || (
                <p className="italic text-gray-400">
                  No detailed content has been written for this story yet. Click "Edit Story" above to add paragraphs, gear info, and styling tips.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Metadata & Quick Stats */}
        <div className="space-y-6">
          {/* Reading Stats Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
              <FaClock className="text-purple-600" />
              Story Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-xs font-bold text-gray-400 block">
                  Views
                </span>
                <span className="text-xl font-black text-gray-800">
                  {blog.views || 0}
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-xs font-bold text-gray-400 block">
                  Read Time
                </span>
                <span className="text-xl font-black text-gray-800">
                  ~{readingTime} min
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-xs font-bold text-gray-400 block">
                  Words
                </span>
                <span className="text-xl font-black text-gray-800">
                  {wordCount}
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-xs font-bold text-gray-400 block">
                  Status
                </span>
                <span
                  className={`text-xs font-black inline-block mt-1 px-2 py-0.5 rounded-full ${
                    blog.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {blog.isPublished ? "Active" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FaLayerGroup className="text-purple-600" />
              Story Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 font-bold block mb-0.5">
                  Category
                </span>
                <span className="font-semibold text-gray-800 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md inline-block">
                  {blog.category}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-0.5">
                  Author
                </span>
                <span className="font-semibold text-gray-800">
                  {blog.author || "Album Studio"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-0.5">
                  Slug / URL Path
                </span>
                <code className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[11px] block truncate">
                  /blog/{blog.slug || blog._id}
                </code>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-0.5">
                  Published Date
                </span>
                <span className="font-semibold text-gray-800">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block mb-0.5">
                  Last Updated
                </span>
                <span className="font-semibold text-gray-800">
                  {formatDate(blog.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-2xl font-black text-gray-900">
                Edit Story
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Slug / URL Keyword
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>

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
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Author
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

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Replace Cover Image (Optional)
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
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="py-6">
                      <FaCloudUploadAlt className="text-4xl text-purple-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-700">
                        Choose a new image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Excerpt / Summary
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Full Content
                </label>
                <textarea
                  name="content"
                  rows={6}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="modalIsPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label
                  htmlFor="modalIsPublished"
                  className="text-sm font-bold text-gray-700 cursor-pointer select-none"
                >
                  Published (Visible to all users on website)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center text-2xl mb-4">
              <FaTrash />
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              Delete This Story?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-800">"{blog.title}"</span>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
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

export default BlogDetailsPage;