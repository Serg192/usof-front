const db = require("../models");

const categoryService = {
  findCategoryByField: async (field, value) => {
    try {
      const post = await db.Categories.findOne({
        where: { [field]: value },
      });
      return post;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  findCategoryByTitle: async (title) =>
    categoryService.findCategoryByField("category_title", title),

  createCategory: async (title, description) => {
    try {
      const newCategory = await db.Categories.create({
        category_title: title,
        category_description: description,
      });
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error.message);
      return null;
    }
  },
  updateCategory: async (categoryId, title, description) => {
    try {
      const updatedCategory = await db.Categories.update(
        { category_title: title, category_description: description },
        { where: { id: categoryId } }
      );

      return updatedCategory[0] === 1;
    } catch (error) {
      console.error("Error updating category:", error.message);
      return false;
    }
  },
  deleteCategory: async (categoryId) => {
    try {
      const deletedRows = await db.Categories.destroy({
        where: { id: categoryId },
      });

      return deletedRows === 1;
    } catch (error) {
      console.error("Error deleting category:", error.message);
      return false;
    }
  },
  getCategoryById: async (categoryId) => {
    try {
      const category = await db.Categories.findByPk(categoryId);

      return category;
    } catch (error) {
      console.error("Error fetching category by ID:", error.message);
      return null;
    }
  },
  getPostsByCategoryId: async (categoryId) => {
    try {
      const category = await db.Categories.findByPk(categoryId, {
        include: [
          {
            model: db.Posts,
            as: "category_posts",
            include: [
              {
                model: db.Likes,
                as: "post_likes",
              },
              {
                model: db.Categories,
                as: "post_categories",
              },
            ],
          },
        ],
      });

      if (category) {
        const posts = category.category_posts.map((post) => {
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
        });

        return posts;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding posts by category ID:", error.message);
      return null;
    }
  },
  getAllCategories: async () => {
    try {
      const categories = await db.Categories.findAll();
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      return null;
    }
  },

  searchByTitle: async (pattern) => {
    try {
      const categories = await db.Categories.findAll({
        where: {
          category_title: {
            [db.Sequelize.Op.like]: `%${pattern}%`,
          },
        },
      });
      return categories;
    } catch (error) {
      console.error("Error finding categories by pattern:", error);
      return [];
    }
  },
};

module.exports = categoryService;
