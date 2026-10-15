// ===== validators/blogValidator.js =====
const { body, query } = require("express-validator");

const blogQueryValidation = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  query("author").optional().isMongoId(),
  query("tag").optional().isString(),
  query("search").optional().isString().isLength({ max: 100 }),
];

const createBlogValidation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),
  body("summary")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Summary cannot exceed 500 characters"),
  body("tags")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Maximum 10 tags allowed"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters"),
];

const updateBlogValidation = [
  body("title").optional().trim().isLength({ min: 5, max: 200 }),
  body("content").optional().trim().isLength({ min: 10 }),
  body("summary").optional().isLength({ max: 500 }),
  body("tags").optional().isArray({ max: 10 }),
];

module.exports = {
  blogQueryValidation,
  createBlogValidation,
  updateBlogValidation,
};
