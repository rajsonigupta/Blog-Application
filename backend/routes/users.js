// ===== routes/users.js =====
const express = require("express");
const User = require("../models/User");
const Blog = require("../models/Blog");
const { userIdParamValidation } = require("../validators/userValidator");

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (public profiles)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select("username bio avatar createdAt blogCount")
      .sort({ blogCount: -1, createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get("/:id", userIdParamValidation, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      isActive: true,
    }).select("username bio avatar createdAt blogCount");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's recent blogs
    const recentBlogs = await Blog.find({
      author: req.params.id,
      isPublished: true,
    })
      .select("title summary createdAt likesCount readTime slug")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user,
        recentBlogs,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
});

module.exports = router;
