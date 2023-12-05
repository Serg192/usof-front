const commentsService = require("../services/comments-service");
const UserDTO = require("../dto/UserDTO");
const ROLES_LIST = require("../config/roles-list");

function getComment(req, res) {
  const commentID = parseInt(req.params.comment_id, 10);
  if (isNaN(commentID)) return res.sendStatus(400);

  commentsService.getCommentById(commentID).then((comment) => {
    if (!comment) return res.sendStatus(404);
    const plainComment = comment.get({ plain: true });

    plainComment.comment_author = new UserDTO(plainComment.comment_author);
    return res.json(plainComment);
  });
}

function getAllLikesUnderComment(req, res) {
  const commentID = parseInt(req.params.comment_id, 10);
  if (isNaN(commentID)) return res.sendStatus(400);

  commentsService.getLikesUnderComment(commentID).then((likes) => {
    if (!likes) return res.sendStatus(404);
    return res.json(likes);
  });
}

function likeComment(req, res) {
  console.log("LIKE COMMENT: ", req.body);
  const commentID = parseInt(req.params.comment_id, 10);
  let type = req.body.type;

  if (isNaN(commentID) || !type) return res.sendStatus(400);

  type = JSON.parse(type);
  if (typeof type != "boolean") {
    return res.sendStatus(400);
  }

  commentsService.getCommentById(commentID).then((comment) => {
    if (comment.user_id == parseInt(req.user.userId)) {
      return res.status(500).json({});
    } else {
      commentsService
        .createLikeUnderComment(commentID, parseInt(req.user.userId), type)
        .then((ok) => {
          if (!ok) return res.sendStatus(500);
          return res.status(200).json({});
        });
    }
  });
}

function updComment(req, res) {
  const commentID = parseInt(req.params.comment_id, 10);
  const userId = req.user.userId;
  const { commentText } = req.body;
  if (isNaN(commentID) || !commentText) return res.sendStatus(400);

  commentsService.getCommentById(commentID).then((comment) => {
    if (!comment) return res.sendStatus(404);
    if (comment.user_id != userId) return res.sendStatus(403);
    commentsService
      .updateComment(commentID, { comment_content: commentText })
      .then((ok) => {
        if (!ok) return res.sendStatus(500);
        return res.sendStatus(200);
      });
  });
}

function deleteComment(req, res) {
  const commentID = parseInt(req.params.comment_id, 10);
  const userId = req.user.userId;
  if (isNaN(commentID)) return res.status(400).json({});

  commentsService.getCommentById(commentID).then((comment) => {
    if (!comment) return res.sendStatus(404);
    if (comment.user_id != userId) {
      if (req.user.userRole !== ROLES_LIST.Admin) return res.sendStatus(403);
    }
    commentsService.deleteComment(commentID).then((ok) => {
      if (!ok) return res.sendStatus(500);
      return res.status(200).json({});
    });
  });
}

function deleteLikeUnderComment(req, res) {
  const commentID = parseInt(req.params.comment_id, 10);
  const userId = req.user.userId;
  if (isNaN(commentID)) return res.sendStatus(400);

  commentsService.deleteLikeByUserId(userId, commentID).then((ok) => {
    if (!ok) return res.sendStatus(404);
    return res.sendStatus(200);
  });
}

module.exports = {
  getComment,
  getAllLikesUnderComment,
  likeComment,
  updComment,
  deleteComment,
  deleteLikeUnderComment,
};
