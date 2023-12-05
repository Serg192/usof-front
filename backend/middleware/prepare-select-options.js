const db = require("../models");

const supportedModels = new Set([db.Posts, db.Users, db.Categories]);

const defaultSortOptionForPosts = "post_likes";

function addPostFilters(selectOptions, req) {
  const statusFilter = req.query.status;
  const categoryFilter = req.query.category;
  const startDateFilter = req.query.startDate;
  const endDateFilter = req.query.endDate;

  if (statusFilter) {
    selectOptions.where.post_status = statusFilter === "active";
  }

  if (categoryFilter) {
    categories = Array.from(categoryFilter.split(","));

    selectOptions.include[1].where = {
      id: {
        [db.Sequelize.Op.in]: categories
          .filter((id) => !isNaN(id))
          .map((id) => parseInt(id, 10)),
      },
    };
  }

  if (startDateFilter && endDateFilter) {
    selectOptions.where.post_publish_date = {
      [db.Sequelize.Op.between]: [
        new Date(startDateFilter),
        new Date(endDateFilter),
      ],
    };
  }
  return selectOptions;
}

function getDefaultSortByForModel(model) {
  switch (model) {
    case db.Posts:
      return defaultSortOptionForPosts;
    default:
      return null;
  }
}

function initSelectOptionsForModel(model) {
  switch (model) {
    case db.Posts:
      return {
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
        where: {},
      };
    case db.Users:
      return {
        attributes: [
          "id",
          "user_login",
          "user_role",
          "user_rating",
          "user_profile_picture",
        ],
      };
    case db.Categories:
      return {
        attributes: [
          "id",
          "category_title",
          "category_description",
          [
            db.Sequelize.literal(
              "(SELECT COUNT(*) FROM `PostCategories` WHERE `PostCategories`.`category_id` = `Categories`.`id`)"
            ),
            "post_count",
          ],
        ],
        raw: true,
      };
    default:
      return null;
  }
}

function configureSortOptions(selectOptions, model, sortBy, sortOrder) {
  if (model === db.Posts) {
    selectOptions.attributes = [
      "id",
      "post_title",
      "post_publish_date",
      "post_content",
      "post_status",
      [
        db.sequelize.literal(
          `(SELECT COUNT(*) FROM likes WHERE likes.post_id = Posts.id AND likes.like_type = true)`
        ),
        "like_count",
      ],
    ];
  }

  switch (model) {
    case db.Posts: {
      if (sortBy === defaultSortOptionForPosts) {
        selectOptions.order = [[db.sequelize.literal("like_count"), sortOrder]];
      } else {
        selectOptions.order = [[sortBy, sortOrder]];
      }
      return selectOptions;
    }
    case db.Categories:
      selectOptions.order = [
        [
          db.Sequelize.literal(
            "(SELECT COUNT(*) FROM `PostCategories` WHERE `PostCategories`.`category_id` = `Categories`.`id`)"
          ),
          sortOrder,
        ],
      ];
      return selectOptions;
    default:
      return selectOptions;
  }
}

function configureFilterOption(selectOptions, model, req) {
  switch (model) {
    case db.Posts:
      selectOptions = addPostFilters(selectOptions, req);
      return selectOptions;
    default:
      return null;
  }
}

function configureSearchOption(selectOptions, model, req) {
  switch (model) {
    case db.Posts:
      const pattern = req.query.search;
      if (!pattern || pattern.length === 0) return selectOptions;
      // selectOptions.where = {
      //   post_title: {
      //     [db.Sequelize.Op.like]: `%${pattern}%`,
      //   },
      // };

      //experimental feature
      const keywords = pattern.split(" ");

      selectOptions.where = {
        [db.Sequelize.Op.or]: keywords.map((keyword) => ({
          post_title: {
            [db.Sequelize.Op.like]: `%${keyword}%`,
          },
        })),
      };
      return selectOptions;
    default:
      return selectOptions;
  }
}

function prepareSelectOptions(model) {
  return async (req, res, next) => {
    if (!supportedModels.has(model)) return res.sendStatus(501);

    //quick hack
    if (model === db.Users || model === db.Categories) {
      res.selectOptions = initSelectOptionsForModel(model);
      res.selectOptions = configureSortOptions(
        res.selectOptions,
        model,
        "",
        req.query.sortOrder || "DESC"
      );
      next();
    } else {
      const sortOrder = req.query.sortOrder || "DESC";
      const sortBy = req.query.sortBy || getDefaultSortByForModel(model);
      let selectOptions = initSelectOptionsForModel(model);
      selectOptions = configureSortOptions(
        selectOptions,
        model,
        sortBy,
        sortOrder
      );
      selectOptions = configureFilterOption(selectOptions, model, req);
      selectOptions = configureSearchOption(selectOptions, model, req);
      if (selectOptions == null) return res.sendStatus(501);
      res.selectOptions = selectOptions;
      next();
    }
  };
}

module.exports = prepareSelectOptions;
