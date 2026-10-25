import asyncHandler from "../../utils/asyncHandler.js";
import mongoose from "mongoose";
import blogModel from "../../models/blogModel.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../middleware/multerS3.js";
import { sanitizeHtml } from "../../utils/sanitizeHtml.js";

const createSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createBlog = asyncHandler(async (req, res) => {
  const { title, slug, category, author, description, content, isPublished } =
    req.body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof category !== "string" ||
    !category.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Blog title and category are required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Blog image is required",
    });
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      success: false,
      message: "Blog image must be an image file",
    });
  }

  const baseSlug =
    createSlug(typeof slug === "string" && slug.trim() ? slug : title) ||
    `blog-${Date.now()}`;
  let uniqueSlug = baseSlug;
  let suffix = 1;

  while (await blogModel.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const imageUpload = await uploadToCloudinary(req.file, "blogs");
  const authorName =
    typeof author === "string" && author.trim()
      ? author.trim()
      : req.user?.name || "Album Studio";

  const blog = await blogModel.create({
    title: title.trim(),
    slug: uniqueSlug,
    category: category.trim(),
    author: authorName,
    image: imageUpload.secure_url,
    publicId: imageUpload.public_id,
    description: typeof description === "string" ? sanitizeHtml(description) : description,
    content: typeof content === "string" ? sanitizeHtml(content) : content,
    isPublished,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId || req.body.blogId || req.query.blogId;

  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(400).json({
      success: false,
      message: "A valid blogId is required",
    });
  }

  const blogFilter = { _id: blogId };
  if (req.user.userType !== "SuperAdmin") {
    blogFilter.createdBy = req.user._id;
  }
  const blog = await blogModel.findOne(blogFilter);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  const { title, slug, category, author, description, content, isPublished } =
    req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog title must be a non-empty string",
      });
    }
    blog.title = title.trim();
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog category must be a non-empty string",
      });
    }
    blog.category = category.trim();
  }

  if (author !== undefined) {
    if (typeof author !== "string") {
      return res.status(400).json({
        success: false,
        message: "Blog author must be a string",
      });
    }
    blog.author = author.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Blog description must be a string",
      });
    }
    blog.description = sanitizeHtml(description);
  }

  if (content !== undefined) {
    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Blog content must be a string",
      });
    }
    blog.content = sanitizeHtml(content);
  }

  if (isPublished !== undefined) {
    if (
      isPublished !== true &&
      isPublished !== false &&
      isPublished !== "true" &&
      isPublished !== "false"
    ) {
      return res.status(400).json({
        success: false,
        message: "isPublished must be true or false",
      });
    }
    blog.isPublished = isPublished === true || isPublished === "true";
  }

  if (slug !== undefined) {
    if (typeof slug !== "string" || !slug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog slug must be a non-empty string",
      });
    }

    const baseSlug = createSlug(slug);
    let uniqueSlug = baseSlug || `blog-${Date.now()}`;
    let suffix = 1;

    while (
      await blogModel.exists({
        slug: uniqueSlug,
        _id: { $ne: blog._id },
      })
    ) {
      uniqueSlug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    blog.slug = uniqueSlug;
  }

  let oldImagePublicId;
  if (req.file) {
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Blog image must be an image file",
      });
    }

    const imageUpload = await uploadToCloudinary(req.file, "blogs");
    oldImagePublicId = blog.publicId;
    blog.image = imageUpload.secure_url;
    blog.publicId = imageUpload.public_id;
  }

  await blog.save();

  if (oldImagePublicId) {
    await deleteFromCloudinary(oldImagePublicId, "image");
  }

  return res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: blog,
  });
});


export const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.query.blogId || req.params.blogId || req.params.id;
  const includeUnpublished =
    req.query.includeUnpublished === "true" ||
    req.query.includeUnpublished === true ||
    req.query.admin === "true";

  if (!blogId) {
    return res.status(400).json({
      success: false,
      message: "A valid blogId or slug is required",
    });
  }

  const currentUser = req.user || null;

  const query = mongoose.isValidObjectId(blogId)
    ? { _id: blogId }
    : { slug: blogId };

  const isAdminView =
    includeUnpublished ||
    req.originalUrl?.includes("/admin") ||
    req.baseUrl?.includes("/admin");

  if (isAdminView) {
    if (currentUser && currentUser.userType === "Admin") {
      query.createdBy = currentUser._id;
    }
  } else {
    query.isPublished = true;
  }

  // Only increment views on public visits, not in admin dashboard
  const shouldIncrementViews = !isAdminView;

  const blog = shouldIncrementViews
    ? await blogModel
        .findOneAndUpdate(query, { $inc: { views: 1 } }, { new: true })
        .populate("createdBy", "name email profileImage userType")
    : await blogModel
        .findOne(query)
        .populate("createdBy", "name email profileImage userType");

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Blog fetched successfully",
    data: blog,
  });
});

export const getBlogByFilter = asyncHandler(async (req, res) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    category,
    author,
    sortBy = "latest",
    isPublished,
    all,
    adminId,
    createdBy,
    isAdmin: isAdminParam,
  } = req.query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    !Number.isInteger(limitNumber) ||
    limitNumber < 1
  ) {
    return res.status(400).json({
      success: false,
      message: "page and limit must be positive integers",
    });
  }

  const safeLimit = Math.min(limitNumber, 100);
  const filter = {};

  const currentUser = req.user || null;

  const isAdminContext =
    req.originalUrl?.includes("/admin") ||
    req.baseUrl?.includes("/admin") ||
    all === "true" ||
    all === true ||
    isAdminParam === "true" ||
    isAdminParam === true;

  // Separate blogs by studio / admin:
  if (currentUser && currentUser.userType === "Admin" && isAdminContext) {
    // Logged in admin in their dashboard MUST only see their own blogs!
    filter.createdBy = currentUser._id;
  } else if (currentUser && currentUser.userType === "SuperAdmin") {
    // SuperAdmin can see all or filter by requested admin/studio
    const targetAdmin = adminId || createdBy;
    if (targetAdmin && mongoose.isValidObjectId(targetAdmin)) {
      filter.createdBy = targetAdmin;
    }
  } else {
    // Public / User requests: filter by studio if adminId/createdBy provided
    const targetAdmin = adminId || createdBy;
    if (targetAdmin && mongoose.isValidObjectId(targetAdmin)) {
      filter.createdBy = targetAdmin;
    }
  }

  if (all === "true" || all === true) {
    // include all blogs regardless of publish status
    if (isPublished !== undefined && isPublished !== "all") {
      filter.isPublished = isPublished === "true" || isPublished === true;
    }
  } else if (isPublished !== undefined) {
    if (isPublished !== "all") {
      filter.isPublished = isPublished === "true" || isPublished === true;
    }
  } else {
    filter.isPublished = true;
  }

  if (typeof search === "string" && search.trim()) {
    const escapedSearch = escapeRegex(search.trim());
    const searchRegex = { $regex: escapedSearch, $options: "i" };
    filter.$or = [
      { title: searchRegex },
      { category: searchRegex },
      { author: searchRegex },
      { description: searchRegex },
      { content: searchRegex },
    ];
  }

  if (typeof category === "string" && category.trim()) {
    filter.category = {
      $regex: escapeRegex(category.trim()),
      $options: "i",
    };
  }

  if (typeof author === "string" && author.trim()) {
    filter.author = {
      $regex: escapeRegex(author.trim()),
      $options: "i",
    };
  }

  const sortOptions = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    title: { title: 1 },
    popular: { views: -1, createdAt: -1 },
  };
  if (
    typeof sortBy !== "string" ||
    !Object.prototype.hasOwnProperty.call(sortOptions, sortBy)
  ) {
    return res.status(400).json({
      success: false,
      message: "sortBy must be latest, oldest, title, or popular",
    });
  }

  const [blogs, totalRecords] = await Promise.all([
    blogModel
      .find(filter)
      .populate("createdBy", "name email profileImage userType")
      .sort(sortOptions[sortBy])
      .skip((pageNumber - 1) * safeLimit)
      .limit(safeLimit),
    blogModel.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalRecords / safeLimit);

  return res.status(200).json({
    success: true,
    message: "Blogs fetched successfully",
    data: blogs,
    pagination: {
      totalRecords,
      currentPage: pageNumber,
      totalPages,
      limit: safeLimit,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    },
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId || req.body.blogId || req.query.blogId;

  if (!mongoose.isValidObjectId(blogId)) {
    return res.status(400).json({
      success: false,
      message: "A valid blogId is required",
    });
  }

  const blogFilter = { _id: blogId };
  if (req.user.userType !== "SuperAdmin") {
    blogFilter.createdBy = req.user._id;
  }

  const blog = await blogModel.findOne(blogFilter);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  if (blog.publicId) {
    await deleteFromCloudinary(blog.publicId, "image");
  }
  await blog.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});