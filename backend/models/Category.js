module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    "Categories",
    {
      category_title: {
        type: DataTypes.STRING(process.env.DEFAULT_WORD_LEN),
        allowNull: false,
      },
      category_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Categories.associate = (models) => {
    Categories.belongsToMany(models.Posts, {
      through: "PostCategories",
      as: "category_posts",
      foreignKey: "category_id",
    });
  };

  return Categories;
};
