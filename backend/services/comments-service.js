const db = require("../models");

const commentsService = {
  getCommentById: async (commentId) => {
    try {
      const comment = await db.Comments.findByPk(commentId, {
        include: [
          {
            model: db.Users,
            as: "comment_author",
          },
        ],
      });

      return comment;
    } catch (error) {
      console.error("Error fetching comment by ID:", error.message);
      return null;
    }
  },
  getPostIdByCommentId: async (commentId) => {
    try {
      const comment = await db.Comments.findByPk(commentId);

      if (!comment) {
        throw new Error("Comment not found");
      }

      const post = await comment.getComment_post();
      return post ? post.id : null;
    } catch (error) {
      console.error("Error getting post ID by comment ID:", error.message);
      return null;
    }
  },
  getLikesUnderComment: async (commentId) => {
    try {
      const commentLikes = await db.Likes.findAll({
        where: {
          commentId: commentId,
        },
      });

      // if (commentLikes.length === 0) {
      //   return {
      //     likesCount: 0,
      //     dislikesCount: 0,
      //     commentLikes: [],
      //   };
      // }

      // const likesCount = commentLikes.filter(
      //   (like) => like.like_type === true
      // ).length;
      // const dislikesCount = commentLikes.filter(
      //   (like) => like.like_type === false
      // ).length;

      return commentLikes;
    } catch (error) {
      console.error("Error fetching likes under comment:", error.message);
      return null;
    }
  },
  createLikeUnderComment: async (commentId, userId, likeType) => {
    try {
      const existingLike = await db.Likes.findOne({
        where: {
          commentId: commentId,
          user_id: userId,
        },
      });

      let userRatingChange = 0;

      if (existingLike) {
        if (!existingLike.like_type && likeType) userRatingChange = 1;
        if (existingLike.like_type && !likeType) userRatingChange = -1;
        await existingLike.update({
          like_publish_date: new Date(),
          like_type: likeType,
        });

        console.log("Like updated successfully");

        return existingLike;
      } else {
        if (likeType) userRatingChange = 1;
        const newLike = await db.Likes.create({
          like_publish_date: new Date(),
          like_type: likeType,
          user_id: userId,
          commentId: commentId,
        });

        const comment = await db.Comments.findByPk(commentId);

        let user = await db.Users.findByPk(comment.user_id);
        if (user) {
          user.user_rating += userRatingChange;
          await user.save();
        }

        console.log("New like created successfully");

        return newLike;
      }
    } catch (error) {
      console.error(
        "Error creating or updating like under comment:",
        error.message
      );
      return null;
    }
  },
  updateComment: async (commentId, updatedData) => {
    try {
      const commentToUpdate = await db.Comments.findByPk(commentId);

      if (!commentToUpdate) {
        throw new Error("Comment not found");
      }

      if (updatedData.comment_publish_date) {
        commentToUpdate.comment_publish_date = updatedData.comment_publish_date;
      }

      if (updatedData.comment_content) {
        commentToUpdate.comment_content = updatedData.comment_content;
      }

      await commentToUpdate.save();

      const updatedComment = await db.Comments.findByPk(commentId);

      return updatedComment;
    } catch (error) {
      console.error("Error updating comment:", error.message);
      return null;
    }
  },
  deleteComment: async (commentId) => {
    try {
      const commentToDelete = await db.Comments.findByPk(commentId, {
        include: [
          {
            model: db.Likes,
            as: "comment_likes",
          },
        ],
      });

      if (!commentToDelete) {
        throw new Error("Comment not found");
      }

      let likes = 0;
      commentToDelete.comment_likes.map((l) => {
        if (l.like_type) likes++;
      });

      let user = await db.Users.findByPk(commentToDelete.user_id);
      if (user) {
        user.user_rating -= likes;
        await user.save();
      }

      await Promise.all(
        commentToDelete.comment_likes.map((like) => like.destroy())
      );

      await commentToDelete.destroy();

      console.log("Comment deleted successfully");

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error.message);
      return false;
    }
  },
  deleteLikeByUserId: async (userId, commentId) => {
    try {
      const likeToDelete = await db.Likes.findOne({
        where: {
          user_id: userId,
          commentId: commentId,
        },
      });

      if (!likeToDelete) {
        throw new Error("Like not found");
      }

      await likeToDelete.destroy();

      console.log("Like deleted successfully");

      let user = await db.Users.findByPk(userId);
      if (user) {
        user.user_rating -= 1;
        await user.save();
      }

      return true;
    } catch (error) {
      console.error("Error deleting like:", error.message);
      return false;
    }
  },
};

module.exports = commentsService;
