import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUserCircle,
  FaTags,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaArrowRight,
  FaEye,
  FaShareAlt,
  FaCheck,
} from "react-icons/fa";
import { getBlogById, getBlogByFilter } from "../../app/blog/blogThunk";
import { clearBlogDetail } from "../../app/blog/blogSlice";

// Fallback demo blogs for offline/demo scenarios
const FALLBACK_BLOGS = [
  {
    _id: "demo-1",
    title: "Top 10 Wedding Photography Poses for Couples",
    category: "Wedding Tips",
    author: "Album Studio",
    createdAt: "2026-06-25T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&auto=format&fit=crop&q=80",
    description:
      "Wedding photography is more than capturing pictures. It is about preserving emotions, smiles and unforgettable memories that stay with you forever.",
    content: `Choosing the right poses helps create natural expressions while making your wedding album look elegant and premium. Whether it's candid moments, romantic close-ups or traditional family portraits, every frame should reflect genuine emotions.

Best Couple Poses:
• Walking hand in hand naturally along scenic paths.
• Forehead touching intimate romantic moment.
• Bride looking away softly while groom smiles.
• Golden hour sunset silhouettes and backlit portraits.
• Candid laughter moments between wedding vows.
• Elegant traditional family royal portraits.
• Dramatic aerial and cinematic wide-angle shots.

"The best wedding photographs are the ones that make you feel the emotions again, even after many years."

Modern wedding photography combines storytelling, cinematic composition and natural emotions. Always discuss your expectations with your photographer before the wedding day to ensure every important moment is beautifully captured.`,
    views: 125,
  },
  {
    _id: "demo-2",
    title: "How to Choose the Best Wedding Photographer",
    category: "Photography",
    author: "Album Studio",
    createdAt: "2026-06-20T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop&q=80",
    description:
      "Important tips, portfolio questions and lighting considerations before hiring a wedding photographer for your special day.",
    content: `Your wedding photographer is one of the most important investments you will make for your big day. 

Here are the key aspects to look for:
1. Review full wedding galleries, not just Instagram highlights.
2. Ensure their lighting style matches your venue (outdoor natural vs indoor grand ballroom).
3. Schedule an in-person or video consultation to verify personality chemistry.
4. Clarify deliverables: digital copies, turnaround time, raw files, and album design inclusions.`,
    views: 99,
  },
  {
    _id: "demo-3",
    title: "5 Creative Pre-Wedding Shoot Ideas for Modern Couples",
    category: "Pre Wedding",
    author: "Album Studio",
    createdAt: "2026-06-15T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1400&auto=format&fit=crop&q=80",
    description:
      "Creative outdoor sunset, heritage palaces, and cinematic indoor pre-wedding shoot concepts tailored for modern couples.",
    content: `Pre-wedding shoots are an opportunity to relax in front of the lens before the wedding festivities begin.

Top Ideas to Try:
• Heritage Havelis and architectural forts with royal attire.
• Casual coffee date or cozy studio setting reflecting your daily life.
• Golden hour beach or lakeside shoot with dramatic reflection frames.
• Minimalist editorial studio portraits with monochrome tones.`,
    views: 157,
  },
];

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { blog, detailLoading, blogs } = useSelector((state) => state.blog);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      dispatch(getBlogById(id));
    }
    // Also fetch list if not loaded yet for related blogs
    if (!blogs || blogs.length === 0) {
      dispatch(getBlogByFilter({ limit: 6 }));
    }

    return () => {
      dispatch(clearBlogDetail());
    };
  }, [dispatch, id, blogs]);

  // Active blog resolution: use Redux state or fallback demo
  const activeBlog = useMemo(() => {
    if (blog) return blog;
    return FALLBACK_BLOGS.find((b) => b._id === id || b.slug === id) || null;
  }, [blog, id]);

  // Related blogs: exclude current blog
  const relatedList = useMemo(() => {
    const sourceList = blogs && blogs.length > 0 ? blogs : FALLBACK_BLOGS;
    return sourceList.filter((b) => (b._id || b.slug) !== id).slice(0, 4);
  }, [blogs, id]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareTitle = activeBlog ? encodeURIComponent(activeBlog.title) : "";
  const currentUrl = encodeURIComponent(window.location.href);

  if (detailLoading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="h-8 w-36 bg-gray-200 rounded-full animate-pulse mb-8" />
        <div className="h-[380px] md:h-[480px] w-full bg-gray-200 rounded-3xl animate-pulse mb-8" />
        <div className="h-10 w-2/3 bg-gray-200 rounded-lg animate-pulse mb-4" />
        <div className="h-6 w-1/3 bg-gray-200 rounded-lg animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!activeBlog) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
        <p className="text-gray-500 mb-8">
          The story you are looking for may have been moved or is currently unavailable.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-[#75405a] hover:bg-[#5b2d47] text-white px-6 py-3 rounded-full font-semibold transition"
        >
          <FaArrowLeft />
          Return to All Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* Back Button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-[#75405a] hover:text-[#ad8242] font-semibold transition"
      >
        <FaArrowLeft />
        Back to Stories
      </Link>

      {/* Hero Image */}
      <div className="mt-6 overflow-hidden rounded-3xl shadow-xl">
        <img
          src={
            activeBlog.image ||
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400"
          }
          alt={activeBlog.title}
          className="w-full h-[320px] md:h-[520px] object-cover"
        />
      </div>

      {/* Title & Metadata */}
      <div className="mt-8">
        <span className="inline-block bg-[#75405a]/10 text-[#75405a] border border-[#75405a]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          {activeBlog.category || "Story"}
        </span>

        <h1 className="text-3xl md:text-5xl font-extrabold mt-4 text-[#35252b] leading-tight tracking-tight">
          {activeBlog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-[#8c7c83]">
          <span className="flex items-center gap-2 font-medium">
            <FaUserCircle className="text-[#ad8242]" />
            {activeBlog.author || "Album Studio"}
          </span>

          <span className="flex items-center gap-2 font-medium">
            <FaCalendarAlt className="text-[#ad8242]" />
            {formatDate(activeBlog.publishedAt || activeBlog.createdAt)}
          </span>

          <span className="flex items-center gap-2 font-medium">
            <FaTags className="text-[#ad8242]" />
            {activeBlog.category || "General"}
          </span>

          {activeBlog.views !== undefined && (
            <span className="flex items-center gap-2 font-medium">
              <FaEye className="text-[#ad8242]" />
              {activeBlog.views} Views
            </span>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-10 mt-10">
        {/* Left / Main Article */}
        <div className="lg:col-span-2">
          {activeBlog.description && (
            <p className="text-lg text-gray-700 leading-relaxed font-medium mb-6 bg-[#fdf9f4] border-l-4 border-[#ad8242] p-5 rounded-r-xl">
              {activeBlog.description}
            </p>
          )}

          <div className="text-gray-700 leading-8 space-y-5 text-base whitespace-pre-line">
            {activeBlog.content ||
              "Wedding photography is all about telling an unforgettable love story through frames that preserve genuine laughter, happy tears, and heartfelt celebrations. Every click represents a timeless memory you will cherish forever."}
          </div>

          {/* Share Article */}
          <div className="border-t border-gray-200 mt-12 pt-8">
            <h3 className="font-bold text-lg text-[#35252b] mb-4 flex items-center gap-2">
              <FaShareAlt className="text-[#ad8242]" />
              Share this Story
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/?text=${shareTitle}%20${currentUrl}`}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                aria-label="Share on Twitter"
              >
                <FaTwitter />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                aria-label="Share on Facebook"
              >
                <FaFacebookF />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <FaCheck className="text-green-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <span>Copy Link</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Related Blogs */}
        <div>
          <div className="bg-[#fffdfa] border border-[#a67d42]/15 rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-[#35252b] mb-5 border-b border-gray-100 pb-3">
              Related Stories
            </h2>

            <div className="space-y-5">
              {relatedList.map((item) => {
                const itemId = item._id || item.slug || item.id;
                return (
                  <Link
                    key={itemId}
                    to={`/blog/${itemId}`}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600"
                      }
                      alt={item.title}
                      className="w-20 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition duration-300"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad8242]">
                        {item.category || "Story"}
                      </span>
                      <h4 className="text-xs font-bold text-[#35252b] group-hover:text-[#75405a] transition line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-[#75405a] font-semibold mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read
                        <FaArrowRight className="text-[9px]" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Sidebar CTA */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-3">
                Planning your wedding or special celebration?
              </p>
              <Link
                to="/book"
                className="w-full inline-block bg-[#ead08c] hover:bg-[#dfc47a] text-[#33242b] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Book Your Shoot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;