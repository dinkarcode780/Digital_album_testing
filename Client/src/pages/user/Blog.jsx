import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaUserCircle,
  FaCamera,
  FaSearch,
  FaTimes,
  FaEye,
  FaRegFolderOpen,
} from "react-icons/fa";
import { getBlogByFilter } from "../../app/blog/blogThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";
import {
  setSelectedCategory,
  setSearchTerm,
  setSortBy,
  setPage,
} from "../../app/blog/blogSlice";

// Curated default stories for fallback if DB is initially empty
const FALLBACK_BLOGS = [
  {
    _id: "demo-1",
    title: "Top 10 Wedding Photography Poses for Couples",
    category: "Wedding Tips",
    author: "Album Studio",
    createdAt: "2026-06-25T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80",
    description:
      "Discover the most beautiful wedding poses that create unforgettable memories and authentic love stories.",
    views: 124,
  },
  {
    _id: "demo-2",
    title: "How to Choose the Best Wedding Photographer",
    category: "Photography",
    author: "Album Studio",
    createdAt: "2026-06-20T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
    description:
      "Important tips, portfolio questions and lighting considerations before hiring a wedding photographer for your special day.",
    views: 98,
  },
  {
    _id: "demo-3",
    title: "5 Creative Pre-Wedding Shoot Ideas for Modern Couples",
    category: "Pre Wedding",
    author: "Album Studio",
    createdAt: "2026-06-15T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&auto=format&fit=crop&q=80",
    description:
      "Creative outdoor sunset, heritage palaces, and cinematic indoor pre-wedding shoot concepts tailored for modern couples.",
    views: 156,
  },
  {
    _id: "demo-4",
    title: "Latest Wedding Photography Trends & Cinematic Teasers 2026",
    category: "Trending",
    author: "Album Studio",
    createdAt: "2026-06-10T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&auto=format&fit=crop&q=80",
    description:
      "Explore the latest editorial, candid drone captures and documentary photography styles every couple loves in 2026.",
    views: 210,
  },
  {
    _id: "demo-5",
    title: "The Art of Candid Photography: Capturing Raw Emotions",
    category: "Candid",
    author: "Album Studio",
    createdAt: "2026-06-05T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80",
    description:
      "Why candid moments make the soul of every album: unscripted laughter, tearful glances, and heartwarming celebrations.",
    views: 87,
  },
  {
    _id: "demo-6",
    title: "Destination Wedding Planning: Ultimate Photography Guide",
    category: "Destination",
    author: "Album Studio",
    createdAt: "2026-06-01T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1544077960-604201fe74bc?w=900&auto=format&fit=crop&q=80",
    description:
      "From scouting golden hour locations to managing multi-day shoot schedules, here is how to preserve your dream destination wedding.",
    views: 142,
  },
];

const Blog = () => {
  const dispatch = useDispatch();
  const {
    blogs,
    loading,
    selectedCategory,
    searchTerm,
    sortBy,
    pagination,
  } = useSelector((state) => state.blog);

  // Event Categories from categoryThunk
  const { eventCategories = [] } = useSelector(
    (state) => state.eventCategory
  );

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Fetch Event Categories on Mount
  useEffect(() => {
    dispatch(
      getEventCategoryByFilter({ page: 1, limit: 100, isActive: true })
    );
  }, [dispatch]);

  // Debounce search update to Redux
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchTerm) {
        dispatch(setSearchTerm(searchInput));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, dispatch]);

  // Fetch blogs on filter / page / sort changes
  useEffect(() => {
    const params = {
      page: pagination.currentPage,
      limit: pagination.limit || 9,
      sortBy: sortBy || "latest",
    };

    if (selectedCategory && selectedCategory !== "All") {
      params.category = selectedCategory;
    }

    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    dispatch(getBlogByFilter(params));
  }, [
    dispatch,
    pagination.currentPage,
    pagination.limit,
    selectedCategory,
    searchTerm,
    sortBy,
  ]);

  // Determine active display blogs (use fallback if DB is empty and no active search)
  const displayBlogs = useMemo(() => {
    if (blogs && blogs.length > 0) {
      return blogs;
    }
    // If the database has 0 records and no search is applied, display fallback blogs
    if (!searchTerm && (!selectedCategory || selectedCategory === "All")) {
      return FALLBACK_BLOGS;
    }
    // If user filtered fallback blogs
    if (selectedCategory && selectedCategory !== "All" && (!blogs || blogs.length === 0) && !searchTerm) {
      return FALLBACK_BLOGS.filter(
        (b) => b.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    return [];
  }, [blogs, searchTerm, selectedCategory]);

  // Extract all categories dynamically from Event Categories + Blogs
  const availableCategories = useMemo(() => {
    const fromEvents = (eventCategories || [])
      .map((c) => c.name?.trim())
      .filter(Boolean);
    const fromBlogs = (blogs || [])
      .map((b) => b.category?.trim())
      .filter(Boolean);
    const base = ["All"];
    const set = new Set([...base, ...fromEvents, ...fromBlogs]);
    return Array.from(set);
  }, [eventCategories, blogs]);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recent";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleCategoryClick = (cat) => {
    dispatch(setSelectedCategory(cat));
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  const handleResetFilters = () => {
    setSearchInput("");
    dispatch(setSearchTerm(""));
    dispatch(setSelectedCategory("All"));
    dispatch(setSortBy("latest"));
  };

  return (
    <main className="blog-page">
      {/* Background Decorations */}
      <div className="blog-orb blog-orb-one" />
      <div className="blog-orb blog-orb-two" />

      {/* ================= HERO ================= */}
      <section className="blog-hero">
        <div className="blog-eyebrow">
          <span className="blog-eyebrow-line" />
          <FaCamera />
          <span>ALBUM STUDIO JOURNAL</span>
          <span className="blog-eyebrow-line" />
        </div>

        <h1 className="blog-title">
          Stories Behind
          <span>Beautiful Moments</span>
        </h1>

        <p className="blog-subtitle">
          Photography inspiration, wedding tips, and timeless love stories crafted to inspire and preserve your unforgettable memories.
        </p>
      </section>

      {/* ================= CONTROLS: SEARCH, FILTER, SORT ================= */}
      <section className="blog-controls">
        <div className="blog-controls-top">
          {/* Search Bar */}
          <div className="blog-search-box">
            <FaSearch className="blog-search-icon" />
            <input
              type="text"
              placeholder="Search stories, tips, photography poses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="blog-search-clear"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="blog-sort-wrapper">
            <span className="blog-sort-label">Sort By:</span>
            <select
              className="blog-sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="latest">Latest Stories</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="blog-categories-wrapper">
          {availableCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`blog-category-chip ${isActive ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= BLOG GRID ================= */}
      <section className="blog-content">
        <div className="blog-grid">
          {/* Loading Skeletons */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="blog-skeleton-card">
                <div className="blog-skeleton-img" />
                <div className="blog-skeleton-body">
                  <div className="blog-skeleton-line" style={{ width: "40%" }} />
                  <div className="blog-skeleton-line" style={{ width: "85%", height: "18px" }} />
                  <div className="blog-skeleton-line" style={{ width: "95%" }} />
                  <div className="blog-skeleton-line" style={{ width: "60%" }} />
                </div>
              </div>
            ))}

          {/* Empty State */}
          {!loading && displayBlogs.length === 0 && (
            <div className="blog-empty-state">
              <div className="blog-empty-icon">
                <FaRegFolderOpen />
              </div>
              <h3 className="blog-empty-title">No Stories Found</h3>
              <p className="blog-empty-subtitle">
                {searchTerm || selectedCategory !== "All"
                  ? `No stories matched your search "${searchTerm || selectedCategory}". Try adjusting your filters or search keywords.`
                  : "No blog articles have been published yet. Check back soon for fresh wedding stories and inspiration!"}
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <button
                  type="button"
                  className="blog-reset-btn"
                  onClick={handleResetFilters}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          )}

          {/* Dynamic Blog Cards */}
          {!loading &&
            displayBlogs.map((blog, index) => {
              const blogId = blog._id || blog.slug || blog.id;
              const linkUrl = `/blog/${blogId}`;
              const imageSrc =
                blog.image ||
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80";

              return (
                <article
                  key={blogId}
                  className="blog-card"
                  style={{
                    "--blog-delay": `${(index % 6) * 100}ms`,
                  }}
                >
                  {/* Image & Category Overlay */}
                  <Link to={linkUrl} className="blog-image-wrap">
                    <img
                      src={imageSrc}
                      alt={blog.title}
                      className="blog-image"
                      loading="lazy"
                    />

                    <div className="blog-image-overlay" />

                    <span className="blog-category">
                      {blog.category || "Story"}
                    </span>

                    <span className="blog-image-arrow">
                      <FaArrowRight />
                    </span>

                    <span className="blog-image-shine" />
                  </Link>

                  {/* Card Content */}
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      <span>
                        <FaUserCircle />
                        {blog.author || "Album Studio"}
                      </span>

                      <span>
                        <FaCalendarAlt />
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </span>

                      {blog.views !== undefined && (
                        <span className="blog-views-count">
                          <FaEye />
                          {blog.views}
                        </span>
                      )}
                    </div>

                    <Link to={linkUrl} className="blog-card-title">
                      {blog.title}
                    </Link>

                    <p className="blog-description">
                      {blog.description ||
                        (blog.content
                          ? blog.content.substring(0, 110) + "..."
                          : "Explore this story to discover helpful tips and inspiring ideas.")}
                    </p>

                    <Link to={linkUrl} className="blog-read-more">
                      <span>Read Story</span>
                      <span className="blog-read-icon">
                        <FaArrowRight />
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="blog-pagination">
            <button
              type="button"
              className="blog-page-btn"
              disabled={pagination.currentPage <= 1}
              onClick={() => dispatch(setPage(pagination.currentPage - 1))}
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`blog-page-btn ${
                    pageNum === pagination.currentPage ? "active" : ""
                  }`}
                  onClick={() => dispatch(setPage(pageNum))}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              type="button"
              className="blog-page-btn"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => dispatch(setPage(pagination.currentPage + 1))}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="blog-bottom">
        <div className="blog-bottom-inner">
          <div className="blog-bottom-icon">
            <FaCamera />
          </div>

          <div>
            <span className="blog-bottom-label">
              YOUR STORY DESERVES TO BE REMEMBERED
            </span>

            <h2>
              Let's capture your
              <span> beautiful moments.</span>
            </h2>
          </div>

          <Link to="/book" className="blog-book-button">
            Book Your Shoot
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Blog;