const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userService = require("../services/user-service");

function handleRefreshToken(req, res) {
  const cookies = req.cookies;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const userLogin = jwt.decode(token)?.userLogin;

  if (!cookies?.jwt || token == null || !userLogin) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  userService.findUserByLogin(userLogin).then((user) => {
    if (!user) return res.sendStatus(403);

    bcrypt.compare(refreshToken, user.user_refresh_token, (err, result) => {
      if (err || !result) {
        return res.sendStatus(403);
      }
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || user.user_login !== decoded.userLogin) {
            return res.sendStatus(403);
          }
          const payload = {
            userId: decoded.userId,
            userLogin: decoded.userLogin,
            userRole: user.user_role,
          };

          const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "5m",
          });
          res.status(200).json({
            accessToken: accessToken,
            role: user.user_role,
            id: user.id,
          });
        }
      );
    });
  });
}

module.exports = {
  handleRefreshToken,
};
