const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getPost,
  getPostComments,
  createPostComment,
  getPostCategories,
  getPostLikes,
  createNewPost,
  createLikeUnderPost,
  updatePost,
  deletePost,
  deletePostLike,
  changeAccess,
} = require("../controllers/posts-controller");

const verifyJWTMid = require("../middleware/verify-jwt");
const pagination = require("../middleware/pagination");
const ROLES_LIST = require("../config/roles-list");
const verifyRoles = require("../middleware/verify-roles");
const activePost = require("../middleware/active-post");
const prepareSelectOptions = require("../middleware/prepare-select-options");
const postSelectAction = require("../middleware/post-selection-action");
const db = require("../models");

router.get(
  "/",
  prepareSelectOptions(db.Posts),
  pagination(db.Posts),
  postSelectAction(db.Posts),
  getAllPosts
);
router.get("/:post_id", getPost);

router.get("/:post_id/comments", getPostComments);
router.post(
  "/:post_id/comments",
  verifyJWTMid,
  activePost(),
  createPostComment
);

router.get("/:post_id/categories", getPostCategories);
router.get("/:post_id/like", getPostLikes);
router.post("/:post_id/like", verifyJWTMid, createLikeUnderPost);

router.post("/", verifyJWTMid, createNewPost);

router.post("/:post_id", verifyJWTMid, activePost(), updatePost);

router.delete("/:post_id", verifyJWTMid, activePost(), deletePost);
router.delete("/:post_id/like", verifyJWTMid, deletePostLike);

router.post(
  "/:post_id/access",
  verifyJWTMid,
  verifyRoles(ROLES_LIST.Admin),
  changeAccess
);

module.exports = router;
