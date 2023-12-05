const express = require("express");
const router = express.Router();

const verifyJWTMid = require("../middleware/verify-jwt");
const activePost = require("../middleware/active-post");

const {
  getComment,
  getAllLikesUnderComment,
  likeComment,
  updComment,
  deleteComment,
  deleteLikeUnderComment,
} = require("../controllers/comments-controller");

const findPostIdByCommentId = async (params) => {
  const postID =
    await require("../services/comments-service").getPostIdByCommentId(
      parseInt(params.comment_id)
    );
  return postID;
};

router.get("/:comment_id", getComment);
router.get("/:comment_id/like", getAllLikesUnderComment);
router.post("/:comment_id/like", verifyJWTMid, likeComment);
router.patch(
  "/:comment_id",
  verifyJWTMid,
  activePost(findPostIdByCommentId),
  updComment
);
router.delete(
  "/:comment_id",
  verifyJWTMid,
  activePost(findPostIdByCommentId),
  deleteComment
);
router.delete("/:comment_id/like", verifyJWTMid, deleteLikeUnderComment);

module.exports = router;
