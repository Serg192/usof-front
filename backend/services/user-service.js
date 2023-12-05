const db = require("../models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { transporter, createMailOption } = require("../mailer");

const userService = {
  getAllUsers: async () => {
    try {
      const allUsers = await db.Users.findAll();
      return allUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  },
  findUserByEmailOrLogin: async (email, login) => {
    try {
      const user = await db.Users.findOne({
        where: {
          [db.Sequelize.Op.or]: [{ user_email: email }, { user_login: login }],
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  findUserByField: async (field, value) => {
    try {
      const user = await db.Users.findOne({
        where: { [field]: value },
      });
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  findUserById: async (id) => userService.findUserByField("id", id),

  findUserByLogin: async (login) =>
    userService.findUserByField("user_login", login),

  findUserByEmail: async (email) =>
    userService.findUserByField("user_email", email),

  createUser: async (data) => {
    try {
      const createdUser = await db.Users.create(data);
      return createdUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  updateUser: async (id, updatedFields) => {
    try {
      const result = await db.Users.update(updatedFields, {
        where: { id: id },
      });

      return true;
    } catch (error) {
      return false;
    }
  },

  registerUser: (user) => {
    const { login, password, email, fullName } = user;

    return bcrypt
      .genSalt(parseInt(process.env.SALT_ROUNDS))
      .then((salt) => {
        return bcrypt.hash(password, salt);
      })
      .then((hash) => {
        return userService.createUser({
          user_login: login,
          user_password: hash,
          user_full_name: fullName,
          user_email: email,
        });
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve({
            status: 500,
            message: "Server error: couldn't create a new user",
          });
        } else {
          return userService.sendEmailConf(email, result.id).then((ok) => {
            if (!ok) {
              return {
                status: 500,
                message:
                  "An error occurred while sending the email. Please verify the correctness of your email address",
              };
            } else {
              return {
                status: 200,
                result: result,
              };
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return Promise.resolve({
          status: 500,
          message: `Server error: ${err.message}`,
        });
      });
  },

  sendEmailConf: async (email, id) => {
    try {
      const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      await transporter.sendMail(
        createMailOption({
          to: email,
          name: "Usof",
          subject: "Email confirmation",
          html: `Please follow this link to confirm your email: <a href="http://localhost:4545/api/auth/confirmation/${token}">Confirm my email</a>`,
        })
      );

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  },
};

module.exports = userService;
