const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const validator = require("validator");
const userService = require("../services/user-service");

const { transporter, createMailOption } = require("../mailer");

const registration = (req, res) => {
  userService.registerUser(req.body).then((result) => {
    if (result.status != 200)
      return res.status(result.status).json({ message: result.message });
    else return res.status(200).json({});
  });
};

const login = (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).send();

  userService.findUserByLogin(login).then((user) => {
    if (!user)
      return res
        .status(401)
        .json({ message: "Login is not present in database" });

    if (user.user_account_deleted) {
      return res.status(401).json({ message: "Account has been deleted" });
    }

    if (!user.user_email_confirmed)
      return res
        .status(401)
        .json({ message: "You should confirm your email first" });

    // if (user.user_email !== email)
    //   return res
    //     .status(401)
    //     .json({ message: "Some credentials are not valid" });

    bcrypt.compare(password, user.user_password, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error happened while comparing user passwords",
        });
      }

      if (result) {
        const payload = {
          userId: user.id,
          userLogin: user.user_login,
          userRole: user.user_role,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "5m",
        });
        const refreshToken = jwt.sign(
          payload,
          process.env.JWT_REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        bcrypt
          .genSalt(parseInt(process.env.SALT_ROUNDS))
          .then((salt) => {
            return bcrypt.hash(refreshToken, salt);
          })
          .then((refreshTokenHash) => {
            userService
              .updateUser(user.id, {
                user_refresh_token: refreshTokenHash,
              })
              .then((result) => {
                if (!result) {
                  res.status(500).json({
                    message: "Server error: db error",
                  });
                } else {
                  res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                  });
                  res.status(200).json({
                    accessToken: accessToken,
                    role: user.user_role,
                    id: user.id,
                  });
                }
              });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ message: `Server error: ${err.message}` });
          });
      } else {
        res.status(401).json({ message: "Password is wrong" });
      }
    });
  });
};

const sendPasswordResetLink = (req, res) => {
  const { email } = req.body;
  if (!email) return res.sendStatus(400);

  userService.findUserByEmail(email).then((user) => {
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email ${email} does not exist` });
    }
    const resetPasswordToken = jwt.sign(
      { userEmail: email },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    transporter.sendMail(
      createMailOption({
        to: email,
        name: "Usof",
        subject: "Password Reset",
        html: `Please follow this link to to reset your password: <a href="http://localhost:4545/api/auth/password-reset/${resetPasswordToken}">Reset password</a>`,
      })
    );
    return res.status(200).json({});
  });
};

const sendPasswordResetForm = (req, res) => {
  jwt.verify(req.params.token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.send("Outdated");
    res.sendFile(path.join(__dirname, "../view", "reset-password-form.html"));
  });
};

const resetPassword = (req, res) => {
  const { password } = req.body;

  const passReg =
    /^(?=.*[A-Z].*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9].*[0-9]).{8,}$/;
  if (
    // !validator.isStrongPassword(password, {
    //   minLength: parseInt(process.env.MIN_PASSWORD_LEN),
    //   minUppercase: parseInt(process.env.MIN_PASSWORD_UPCASE),
    //   minNumbers: parseInt(process.env.MIN_PASSWORD_NUMS),
    //   minSymbols: parseInt(process.env.MIN_PASSWORD_SCHARS),
    // })
    !passReg.test(password)
  ) {
    return res.json({
      message: `"The password must be at least ${process.env.MIN_PASSWORD_LEN} characters long, contain at least ${process.env.MIN_PASSWORD_UPCASE} uppercase letters, at least ${process.env.MIN_PASSWORD_NUMS} numbers, and at least ${process.env.MIN_PASSWORD_SCHARS} special characters."`,
    });
  } else {
    jwt.verify(req.params.token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.send("Link is outdated");
      userService.findUserByEmail(user.userEmail).then((user) => {
        if (!user) {
          return res.send(`Can't find user with email: ${user.userEmail}`);
        }
        bcrypt
          .genSalt(parseInt(process.env.SALT_ROUNDS))
          .then((salt) => {
            return bcrypt.hash(password, salt);
          })
          .then((hash) => {
            userService
              .updateUser(user.id, {
                user_password: hash,
              })
              .then((result) => {
                if (!result) {
                  return res.send("Error");
                } else {
                  return res.send("Success");
                }
              });
          });
      });
    });
  }
};

const confirmation = (req, res) => {
  try {
    const { id } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    userService
      .updateUser(id, {
        user_email_confirmed: true,
      })
      .then((ok) => {
        if (ok) {
          res.status(200).send("Success");
        } else {
          res.status(500).send("Error");
        }
      });
  } catch (error) {
    res.status(500).send("Error");
  }
};

// async function sendEmailConf(email, id) {
//   try {
//     const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     await transporter.sendMail(
//       createMailOption({
//         to: email,
//         name: "Usof",
//         subject: "Email confirmation",
//         html: `Please follow this link to confirm your email: <a href="http://localhost:4545/api/auth/confirmation/${token}">Confirm my email</a>`,
//       })
//     );

//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return false;
//   }
// }

module.exports = {
  registration,
  confirmation,
  login,
  sendPasswordResetLink,
  sendPasswordResetForm,
  resetPassword,
};
