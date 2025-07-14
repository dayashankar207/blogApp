const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const {
  registerValidator,
  loginValidator,
} = require("../zodValidators/authValidators");

router.post("/register", validate(registerValidator), authController.register);

router.post("/login", validate(loginValidator), authController.login);

router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
