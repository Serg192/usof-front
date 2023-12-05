const db = require("../models");

const postService = {
  getAllPosts: async () => {
    try {
      const allPosts = await db.Posts.findAll();
      return allPosts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return null;
    }
  },
  getAllPostsByUserId: async (userId) => {
    try {
      const posts = await db.Posts.findAll({
        attributes: [
          "id",
          "post_title",
          "post_publish_date",
          "post_content",
          "post_status",
          [
            db.Sequelize.literal(
              `(SELECT COUNT(*) FROM likes WHERE likes.post_id = Posts.id AND likes.like_type = true)`
            ),
            "like_count",
          ],
        ],
        where: {
          user_id: userId,
        },
        include: [
          {
            model: db.Users,
            as: "post_author",
            attributes: ["id", "user_login", "user_profile_picture"],
          },
          {
            model: db.Categories,
            as: "post_categories",
            attributes: ["id", "category_title", "category_description"],
          },
          {
            model: db.Likes,
            as: "post_likes",
          },
          {
            model: db.Comments,
            as: "post_comments",
          },
        ],
      });

      return posts;
    } catch (error) {
      console.error("Error fetching posts by user ID:", error);
      return null;
    }
  },

  findPostByField: async (field, value) => {
    try {
      const post = await db.Posts.findOne({
        where: { [field]: value },
      });
      return post;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  findPostById: async (postId) => {
    try {
      const post = await db.Posts.findByPk(postId, {
        include: [
          {
            model: db.Likes,
            as: "post_likes",
          },
          {
            model: db.Categories,
            as: "post_categories",
          },
          {
            model: db.Users,
            as: "post_author",
            attributes: ["id", "user_login", "user_profile_picture"],
          },
        ],
      });

      if (post) {
        const likesCount = post.post_likes.filter(
          (like) => like.like_type === true
        ).length;
        const dislikesCount = post.post_likes.filter(
          (like) => like.like_type === false
        ).length;

        const postCategories = post.post_categories.map((category) => ({
          category_id: category.id,
          category_title: category.category_title,
          category_description: category.category_description,
        }));

        const postWithoutLikesAndCategories = {
          id: post.id,
          post_title: post.post_title,
          post_publish_date: post.post_publish_date,
          post_status: post.post_status,
          post_content: post.post_content,
          user_id: post.user_id,
          likesCount,
          dislikesCount,
          postCategories,
        };

        return postWithoutLikesAndCategories;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding post by ID:", error.message);
      return null;
    }
  },

  getAllCommentsForPost: async (postId) => {
    try {
      const post = await db.Posts.findByPk(postId, {
        include: [
          {
            model: db.Comments,
            as: "post_comments",
            include: [
              {
                model: db.Users,
                as: "comment_author",
                attributes: [
                  "id",
                  "user_login",
                  "user_profile_picture",
                  "user_rating",
                ],
              },
            ],
          },
        ],
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const comments = post.post_comments;

      return comments;
    } catch (error) {
      console.error("Error getting comments:", error.message);
      return null;
    }
  },
  addCommentToPost: async (postId, userId, commentData) => {
    try {
      const post = await db.Posts.findByPk(postId);

      if (!post) {
        throw new Error("Post not found");
      }

      const comment = await db.Comments.create({
        comment_publish_date: commentData.publishDate,
        comment_content: commentData.content,
        user_id: userId,
        post_id: postId,
      });

      await post.addPost_comments(comment);

      console.log("Comment added to the post successfully:", comment);

      return comment;
    } catch (error) {
      console.error("Error adding comment:", error.message);
      return null;
    }
  },

  getAllCategoriesForPost: async (postId) => {
    try {
      const post = await db.Posts.findByPk(postId, {
        include: [{ model: db.Categories, as: "post_categories" }],
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const categories = post.post_categories;

      console.log("Categories for the post:", categories);

      return categories;
    } catch (error) {
      console.error("Error getting categories:", error.message);
      return null;
    }
  },
  getPostLikes: async (postId) => {
    try {
      const post = await db.Posts.findByPk(postId, {
        include: [{ model: db.Likes, as: "post_likes" }],
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const postLikes = post.post_likes;

      console.log("Likes for the post:", postLikes);

      return postLikes;
    } catch (error) {
      console.error("Error getting post likes:", error.message);
      return null;
    }
  },
  createNewPost: async (authorId, title, publishDate, content, categoryIds) => {
    try {
      const newPost = await db.Posts.create({
        post_title: title,
        post_publish_date: publishDate,
        post_status: true,
        post_content: content,
        user_id: authorId,
      });

      const associatedCategories = await db.Categories.findAll({
        where: {
          id: categoryIds,
        },
      });

      await newPost.setPost_categories(associatedCategories);

      console.log("New post created successfully:", newPost);

      return newPost;
    } catch (error) {
      console.error("Error creating new post:", error.message);
      throw error;
    }
  },
  createOrUpdateLike: async (userId, postId, likeType) => {
    try {
      let existingLike = await db.Likes.findOne({
        where: {
          user_id: userId,
          post_id: postId,
        },
      });

      let userRatingChange = 0;

      if (existingLike) {
        if (!existingLike.like_type && likeType) userRatingChange = 1;
        if (existingLike.like_type && !likeType) userRatingChange = -1;
        existingLike.like_type = likeType;
        await existingLike.save();
      } else {
        if (likeType) userRatingChange = 1;
        await db.Likes.create({
          like_publish_date: new Date(),
          like_type: likeType,
          user_id: userId,
          post_id: postId,
        });
      }

      const post = await db.Posts.findByPk(postId);
      const user_id = post.user_id;
      let user = await db.Users.findByPk(user_id);
      if (user) {
        user.user_rating += userRatingChange;
        await user.save();
      }

      console.log("Like added/updated successfully");
      return true;
    } catch (error) {
      console.error("Error adding/updating like:", error.message);
      return false;
    }
  },
  updatePost: async (postId, title, publishDate, content, categoryIds) => {
    try {
      const existingPost = await db.Posts.findByPk(postId);

      if (!existingPost) {
        throw new Error("Post not found");
      }

      existingPost.post_title = title;
      existingPost.post_publish_date = publishDate;
      existingPost.post_content = content;

      await existingPost.save();

      const associatedCategories = await db.Categories.findAll({
        where: {
          id: categoryIds,
        },
      });

      await existingPost.setPost_categories(associatedCategories);

      console.log("Post updated successfully:", existingPost);

      return existingPost;
    } catch (error) {
      console.error("Error updating post:", error.message);
      return null;
    }
  },
  deletePost: async (postId) => {
    try {
      const postToDelete = await db.Posts.findByPk(postId, {
        include: [
          {
            model: db.Comments,
            as: "post_comments",
            include: [{ model: db.Likes, as: "comment_likes" }],
          },
          { model: db.Likes, as: "post_likes" },
        ],
      });

      if (!postToDelete) {
        throw new Error("Post not found");
      }

      const userId = postToDelete.user_id;

      let likes = 0;
      postToDelete.post_likes.map((l) => {
        if (l.like_type) likes++;
      });

      let user = await db.Users.findByPk(userId);
      if (user) {
        user.user_rating -= likes;
        await user.save();
      }

      await db.Likes.destroy({ where: { post_id: postId } });

      for (const comment of postToDelete.post_comments) {
        await db.Likes.destroy({ where: { commentId: comment.id } });
      }
      await db.Comments.destroy({ where: { post_id: postId } });

      await postToDelete.destroy();

      return true;
    } catch (error) {
      return false;
    }
  },
  deletePostLike: async (userId, postId) => {
    try {
      const likeToDelete = await db.Likes.findOne({
        where: {
          user_id: userId,
          post_id: postId,
        },
      });

      if (!likeToDelete) {
        throw new Error("Like not found");
      }

      const post = await db.Posts.findByPk(postId);
      const user_id = post.user_id;
      let user = await db.Users.findByPk(user_id);
      if (user) {
        user.user_rating -= 1;
        await user.save();
      }

      await likeToDelete.destroy();

      return true;
    } catch (error) {
      return false;
    }
  },
  setPostStatus: async (postId, status) => {
    try {
      const post = await db.Posts.findByPk(postId);

      if (!post) {
        throw new Error("Post not found");
      }

      await post.update({ post_status: status });

      console.log(`Post status updated successfully: ${post.post_title}`);

      return post;
    } catch (error) {
      console.error("Error updating post status:", error.message);
      return false;
    }
  },
};

module.exports = postService;
