const router = require("express").Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator/check");
const checkValidation = require("../middleware/validation");

router.post(
  "/",
  [
    body("name")
      .trim()
      .isLength({ min: 5, max: 180 }),
    body("email")
      .trim()
      .isLength({ min: 5, max: 180 })
      .isEmail(),
    body("password")
      .trim()
      .isLength({ min: 8, max: 180 })
  ],
  checkValidation,
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isLength({ min: 5, max: 180 })
      .isEmail(),
    body("password")
      .trim()
      .isLength({ min: 8, max: 180 })
  ],
  checkValidation,
  authController.login
);

module.exports = router;
