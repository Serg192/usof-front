module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    "Posts",
    {
      post_title: {
        type: DataTypes.STRING(process.env.DEFAULT_SENTENCE_LEN),
        allowNull: false,
      },
      post_publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      post_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      post_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {
      as: "post_author",
      foreignKey: {
        name: "user_id",
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
        },
      },
    });
    Posts.belongsToMany(models.Categories, {
      through: "PostCategories",
      as: "post_categories",
      foreignKey: "post_id",
    });
    Posts.hasMany(models.Comments, {
      as: "post_comments",
    });
    // Posts.hasMany(models.Likes, {
    //   as: "post_likes",
    // });

    Posts.hasMany(models.Likes, {
      as: "post_likes",
      foreignKey: "post_id",
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN like_type = true THEN 1 ELSE 0 END")
          ),
          "like_count",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN like_type = false THEN 1 ELSE 0 END")
          ),
          "dislike_count",
        ],
      ],
      group: ["Posts.id"],
    });
  };

  return Posts;
};
