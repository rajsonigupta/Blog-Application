// ===== validators/userValidator.js =====
const { param } = require("express-validator");

const userIdParamValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

module.exports = {
  userIdParamValidation,
};
