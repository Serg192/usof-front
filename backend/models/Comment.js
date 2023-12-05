module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
    {
      comment_publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      comment_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      as: "comment_author",
      foreignKey: "user_id",
    });
    Comments.hasMany(models.Likes, {
      as: "comment_likes",
    });
    Comments.belongsTo(models.Posts, {
      as: "comment_post",
      foreignKey: {
        name: "post_id",
        allowNull: false,
      },
    });
  };

  return Comments;
};
