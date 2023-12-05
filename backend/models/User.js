const ROLES_LIST = require("../config/roles-list");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      user_login: {
        type: DataTypes.STRING(process.env.MAX_LOGIN_LEN),
        unique: true,
        allowNull: false,
      },
      user_password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_full_name: {
        type: DataTypes.STRING(process.env.MAX_USER_FULL_NAME_LEN),
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING(process.env.MAX_EMAIL_LEN),
        unique: true,
        //allowNull: false,
      },
      user_role: {
        type: DataTypes.ENUM(ROLES_LIST.Admin, ROLES_LIST.User),
        defaultValue: ROLES_LIST.User,
      },

      user_rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      user_profile_picture: {
        type: DataTypes.STRING(process.env.DEFAULT_SENTENSE_LEN),
        defaultValue: "default.png",
      },
      user_email_confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      user_account_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      user_refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return Users;
};
