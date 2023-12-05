var fs = require("fs");

const { dataValidator, ValidationResult } = require("../validation");

const UserDTO = require("../dto/UserDTO");
const ROLES_LIST = require("../config/roles-list");
const userService = require("../services/user-service");
const postService = require("../services/post-service");

function getAllUsers(req, res) {
  console.log("Controller ");
  return res.json(res.items_json);
  // userService.getAllUsers().then((users) => {
  //   if (!users)
  //     return res.status(500).json({ message: "Error fetching users" });

  //   let usersJSON = users.map((user) => new UserDTO(user));
  //   res.json(usersJSON);
  // });
}

function getUser(req, res) {
  const userId = parseInt(req.params.user_id, 10);

  if (isNaN(userId)) {
    return res.sendStatus(400);
  }

  userService.findUserById(userId).then((user) => {
    if (!user) return res.sendStatus(404);
    res.json(new UserDTO(user));
  });
}

async function createUser(req, res) {
  if (
    !req.body.role ||
    !(req.body.role === ROLES_LIST.Admin || req.body.role === ROLES_LIST.User)
  ) {
    return res.sendStatus(400);
  }
  userService.registerUser(req.body).then((result) => {
    if (result.status != 200) {
      return res.status(result.status).json({ message: result.message });
    } else {
      userService
        .updateUser(result.result.id, {
          user_role: req.body.role,
        })
        .then((r) => {
          if (!r) {
            return res.sendStatus(500);
          } else {
            return res.sendStatus(200);
          }
        });
    }
  });
}

function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.sendStatus(400);
    }

    const userID = parseInt(req.user.userId);
    const imageName = req.file.filename;

    userService.findUserById(userID).then((user) => {
      if (!user) return res.sendStatus(404);

      userService
        .updateUser(userID, {
          user_profile_picture: imageName,
        })
        .then((ok) => {
          if (!ok) return res.sendStatus(500);

          if (user.user_profile_picture !== "default.png") {
            fs.unlinkSync(
              process.env.FILE_UPLOAD_PATH + `/${user.user_profile_picture}`
            );
          }
          return res.status(200).json({});
        });
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function updateUserData(req, res) {
  try {
    const editUserID = parseInt(req.user.userId);

    const { login, fullName, role } = req.body;

    if (!login || !fullName) return res.sendStatus(400);

    const userRole = req.user.userRole;

    if (userRole === ROLES_LIST.User && req.user.userId != req.params.user_id)
      return res.sendStatus(401);

    if (userRole === ROLES_LIST.Admin) {
      if (!role || !(role == ROLES_LIST.Admin || role == ROLES_LIST.User))
        return res.sendStatus(400);
    }

    if (
      dataValidator.checkLoginLen(login) === ValidationResult.INVALID ||
      dataValidator.checkFullNameLen(fullName) === ValidationResult.INVALID ||
      dataValidator.checkIfFullNameIsValid(fullName) ===
        ValidationResult.INVALID ||
      (await dataValidator.checkIfNewLoginIsValid(login, editUserID)) ===
        ValidationResult.INVALID
    ) {
      return res.status(400).json({ message: ValidationResult.INVALID.msg });
    }

    const updatePayload = {
      user_full_name: fullName,
    };

    if (login !== req.user.userLogin) updatePayload.user_login = login;
    if (userRole === ROLES_LIST.Admin) updatePayload.user_role = role;

    userService.updateUser(editUserID, updatePayload).then((ok) => {
      if (!ok) {
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    });
  } catch (err) {
    return res.sendStatus(500);
  }
}

function deleteUser(req, res) {
  try {
    const eUserID = parseInt(req.params.user_id);
    const userRole = req.user.role;

    //User can't delete other users
    if (userRole === ROLES_LIST.User && eUserID != req.params.user_id)
      return res.sendStatus(401);

    userService
      .updateUser(eUserID, {
        user_email: null,
        user_account_deleted: true,
      })
      .then((ok) => {
        if (!ok) {
          return res.sendStatus(500);
        }
        return res.sendStatus(200);
      });
  } catch (err) {
    return res.sendStatus(404);
  }
}

function getUserPosts(req, res) {
  const userId = parseInt(req.params.user_id);

  if (!userId) return res.status(404).json({});

  postService.getAllPostsByUserId(userId).then((posts) => {
    if (!posts) return res.status(404).json({});
    return res.status(200).json(posts);
  });
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  uploadAvatar,
  updateUserData,
  deleteUser,
  getUserPosts,
};
