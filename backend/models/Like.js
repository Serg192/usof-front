module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define(
    "Likes",
    {
      like_publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      like_type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
    }
  );
  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      as: "like_author",
      foreignKey: {
        name: "user_id",
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    });
    Likes.belongsTo(models.Posts, {
      targetKey: "id",
      as: "liked_post",
      foreignKey: "post_id",
    });

    Likes.belongsTo(models.Comments, {
      targetKey: "id",
      as: "liked_comment",
      foreignKey: {
        name: "commentId",
        allowNull: true,
      },
    });
  };
  return Likes;
};
