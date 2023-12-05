const postService = require("../services/post-service");

function activePost(findPostIdFunc = null) {
  return async (req, res, next) => {
    let postID;

    if (findPostIdFunc != null) {
      postID = await findPostIdFunc(req.params);
      if (!postID) return res.sendStatus(404);
    } else {
      postID = req.params.post_id;
      if (isNaN(postID)) return res.sendStatus(400);
    }

    postService.findPostById(postID).then((post) => {
      if (!post) return res.sendStatus(404);
      //if locked
      if (post.post_status == false) return res.sendStatus(405);
      next();
    });
  };
}

module.exports = activePost;
