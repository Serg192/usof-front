const postService = require("../services/post-service");
const ROLES_LIST = require("../config/roles-list");

function getAllPosts(req, res) {
  return res.json(res.items_json);
}

function getPost(req, res) {
  const postId = parseInt(req.params.post_id, 10);

  if (isNaN(postId)) {
    return res.sendStatus(400);
  }

  postService.findPostById(postId).then((post) => {
    if (!post) return res.sendStatus(404);
    res.json(post);
  });
}

function getPostComments(req, res) {
  const postId = parseInt(req.params.post_id, 10);

  if (isNaN(postId)) {
    return res.sendStatus(400);
  }

  postService.getAllCommentsForPost(postId).then((comments) => {
    if (!comments) res.sendStatus(404);
    res.json(comments);
  });
}

function createPostComment(req, res) {
  const postId = parseInt(req.params.post_id, 10);
  const userId = req.user.userId;
  const { commentText } = req.body;

  if (isNaN(postId) || !commentText) {
    return res.status(400).json({});
  }

  postService
    .addCommentToPost(postId, userId, {
      publishDate: new Date(),
      content: commentText,
    })
    .then((comment) => {
      if (!comment)
        return res.status(500).json({ message: "Failed to create comment" });
      return res.status(200).json({});
    });
}

function getPostCategories(req, res) {
  const postId = parseInt(req.params.post_id, 10);
  if (isNaN(postId)) {
    return res.sendStatus(400);
  }

  postService.getAllCategoriesForPost(postId).then((categories) => {
    if (!categories) return res.sendStatus(404);
    return res.status(200).json(categories);
  });
}

function getPostLikes(req, res) {
  const postId = parseInt(req.params.post_id, 10);
  if (isNaN(postId)) {
    return res.sendStatus(400);
  }

  postService.getPostLikes(postId).then((likes) => {
    if (!likes) return res.sendStatus(404);
    return res.status(200).json(likes);
  });
}

function createNewPost(req, res) {
  const { title, content, categoryIds } = req.body;

  if (!title || !content || !categoryIds || categoryIds.length === 0) {
    return res.sendStatus(400);
  }

  postService
    .createNewPost(
      parseInt(req.user.userId),
      title,
      new Date(),
      content,
      categoryIds
    )
    .then((post) => {
      res.status(200).json({ post });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
}

function createLikeUnderPost(req, res) {
  console.log("LIKE UNDER POST: ", req.body);
  const postId = parseInt(req.params.post_id, 10);
  let type = req.body.type;

  if (isNaN(postId) || !type) {
    return res.sendStatus(400);
  }

  type = JSON.parse(type);
  if (typeof type != "boolean") {
    return res.sendStatus(400);
  }

  postService.findPostById(postId).then((post) => {
    if (post.user_id == parseInt(req.user.userId)) {
      return res.sendStatus(500);
    } else {
      postService
        .createOrUpdateLike(parseInt(req.user.userId), postId, type)
        .then((ok) => {
          if (!ok) return res.sendStatus(500);
          return res.status(200).json({});
        });
    }
  });
}

function updatePost(req, res) {
  const postId = parseInt(req.params.post_id, 10);
  const { title, content, categoryIds } = req.body;

  if (!title || !content || !categoryIds || categoryIds.length === 0) {
    return res.sendStatus(400);
  }

  if (isNaN(postId)) {
    return res.sendStatus(400);
  }

  postService.findPostById(postId).then((post) => {
    if (!post) return res.sendStatus(404);
    if (post.user_id != req.user.userId) return res.sendStatus(403);
    postService
      .updatePost(postId, title, new Date(), content, categoryIds)
      .then((ok) => {
        if (!ok) return res.sendStatus(500);
        return res.status(200).json({ post: ok });
      });
  });
}

function deletePost(req, res) {
  const postId = parseInt(req.params.post_id, 10);

  if (isNaN(postId)) {
    return res.sendStatus(400);
  }
  postService.findPostById(postId).then((post) => {
    if (!post) return res.sendStatus(404);

    if (
      post.user_id != req.user.userId &&
      req.user.userRole !== ROLES_LIST.Admin
    ) {
      return res.sendStatus(403);
    }

    postService.deletePost(postId).then((ok) => {
      if (!ok) return res.sendStatus(500);
      return res.status(200).json({});
    });
  });
}

function deletePostLike(req, res) {
  const postId = parseInt(req.params.post_id, 10);

  if (isNaN(postId)) {
    return res.status(400).json({});
  }

  postService.deletePostLike(parseInt(req.user.userId), postId).then((ok) => {
    if (!ok) return res.sendStatus(500);
    return res.status(200).json({});
  });
}

function changeAccess(req, res) {
  let { active } = req.body;
  const postId = parseInt(req.params.post_id, 10);

  if (isNaN(postId) || !active) {
    return res.sendStatus(400);
  }

  active = JSON.parse(active);
  if (typeof active != "boolean") {
    return res.sendStatus(400);
  }

  postService.setPostStatus(postId, active).then((ok) => {
    if (!ok) return res.sendStatus(404);
    return res.status(200).json({});
  });
}

module.exports = {
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
};
