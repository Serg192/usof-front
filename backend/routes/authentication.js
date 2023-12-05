const express = require("express");

const router = express.Router();

const {
  registration,
  confirmation,
  login,
  sendPasswordResetLink,
  sendPasswordResetForm,
  resetPassword,
} = require("../controllers/auth-controller");

const {
  handleRefreshToken,
} = require("../controllers/refresh-token-controller");

const { handleLogout } = require("../controllers/logout-controller");

const authRegDataValidationMid = require("../middleware/auth-reg-data-validation");
const verifyJWTMid = require("../middleware/verify-jwt");

router.post("/register", authRegDataValidationMid, registration);
router.post("/login", login);
router.post("/password-reset", sendPasswordResetLink);
router.get("/password-reset/:token", sendPasswordResetForm);
router.post("/password-reset/:token", resetPassword);
router.post("/logout", verifyJWTMid, handleLogout);
router.get("/confirmation/:token", confirmation);
router.get("/refresh", handleRefreshToken);

module.exports = router;
