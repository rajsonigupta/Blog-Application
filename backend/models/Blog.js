// ===== models/Blog.js =====
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
      minlength: [10, "Content must be at least 10 characters long"],
    },
    summary: {
      type: String,
      maxlength: [500, "Summary cannot exceed 500 characters"],
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number, // in minutes
      default: 1,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
blogSchema.index({ author: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ likesCount: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isPublished: 1 });

// Generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("title")) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now();
  }

  // Calculate read time (assuming 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200) || 1;
  }

  next();
});

// Update likesCount when likes array is modified
blogSchema.pre("save", function (next) {
  if (this.isModified("likes")) {
    this.likesCount = this.likes.length;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
