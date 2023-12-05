const jwt = require("jsonwebtoken");
const userService = require("../services/user-service");

function handleLogout(req, res) {
  const cookies = req.cookies;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const userLogin = jwt.decode(token)?.userLogin;

  if (!cookies?.jwt || token == null || !userLogin) return res.sendStatus(204);

  userService.findUserByLogin(userLogin).then((user) => {
    if (!user) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }
    userService
      .updateUser(user.id, {
        user_refresh_token: null,
      })
      .then((result) => {
        if (!result) {
          res.status(500).json({
            message: "Server error: db error",
          });
        } else {
          res.clearCookie("jwt", { httpOnly: true });
          return res.sendStatus(204);
        }
      });
  });
}

module.exports = {
  handleLogout,
};
