// ===== routes/blogs.js =====
const express = require("express");
const { validationResult } = require("express-validator");
const {
  blogQueryValidation,
  createBlogValidation,
  updateBlogValidation,
} = require("../validators/blogValidator");
const Blog = require("../models/Blog");
const User = require("../models/User");
const auth = require("../middlewares/auth");

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs with filtering and pagination
// @access  Public
router.get("/", blogQueryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isPublished: true };

    if (req.query.author) {
      query.author = req.query.author;
    }

    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
        { summary: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate("author", "username avatar bio")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username avatar bio")
      .populate("likes.user", "username");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    console.error("Get blog error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post("/", auth, createBlogValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, content, summary, tags, isPublished } = req.body;

    const blog = new Blog({
      title,
      content,
      summary: summary || content.substring(0, 200) + "...",
      author: req.user._id,
      tags: tags || [],
      isPublished: isPublished !== false,
    });

    await blog.save();
    await blog.populate("author", "username avatar bio");

    // Update user's blog count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { blogCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: { blog },
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put("/:id", auth, updateBlogValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own blogs.",
      });
    }

    const { title, content, summary, tags, isPublished } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(content && { content }),
        ...(summary && { summary }),
        ...(tags && { tags }),
        ...(isPublished !== undefined && { isPublished }),
      },
      { new: true, runValidators: true }
    ).populate("author", "username avatar bio");

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: { blog: updatedBlog },
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own blogs.",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    // Update user's blog count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { blogCount: -1 },
    });

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Toggle like on a blog
// @access  Private
router.post("/:id/like", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user._id;
    const likeIndex = blog.likes.findIndex(
      (like) => like.user.toString() === userId.toString()
    );

    let message;
    if (likeIndex > -1) {
      // Unlike the blog
      blog.likes.splice(likeIndex, 1);
      message = "Blog unliked successfully";
    } else {
      // Like the blog
      blog.likes.push({ user: userId });
      message = "Blog liked successfully";
    }

    await blog.save();
    await blog.populate([
      { path: "author", select: "username avatar bio" },
      { path: "likes.user", select: "username" },
    ]);

    res.json({
      success: true,
      message,
      data: {
        blog,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
    });
  }
});

// @route   GET /api/blogs/user/:userId
// @desc    Get blogs by specific user
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.params.userId,
      isPublished: true,
    })
      .populate("author", "username avatar bio")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: { blogs },
    });
  } catch (error) {
    console.error("Get user blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user blogs",
    });
  }
});

module.exports = router;
