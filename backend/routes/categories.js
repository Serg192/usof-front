const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getPostsByCategory,
  getAllCategories,
  searchCategories,
} = require("../controllers/categories-controller");

const verifyJWTMid = require("../middleware/verify-jwt");
const pagination = require("../middleware/pagination");
const prepareSelectOptions = require("../middleware/prepare-select-options");
const db = require("../models");

//This is deprecated and does not support sorting and filtering
//Use /api/posts/ endpoint with filter option ?category=[category_id] instead!
router.get(
  "/:category_id/posts",
  pagination(null, (params) => {
    return require("../services/category-service").getPostsByCategoryId(
      parseInt(params.category_id)
    );
  }),
  getPostsByCategory
);

router.get("/search", searchCategories);

router.get(
  "/",
  prepareSelectOptions(db.Categories),
  pagination(db.Categories),
  getAllCategories
);
router.get("/:category_id", getCategory);
router.post("/", verifyJWTMid, createCategory);
router.patch("/:category_id", verifyJWTMid, updateCategory);
router.delete("/:category_id", verifyJWTMid, deleteCategory);

module.exports = router;
