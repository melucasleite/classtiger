const express = require("express");
const { body } = require("express-validator/check");
const router = express.Router();
const checkValidation = require("../middleware/validation");
const isAuth = require("../middleware/is-auth");
const studentController = require("../controllers/student");

router.get("/", isAuth, studentController.getStudents);

router.post(
  "/",
  isAuth,
  [
    body("name")
      .trim()
      .isLength({ min: 5 }),
    body("email")
      .trim()
      .isEmail()
      .isLength({ min: 5 }),
    body("cellphone")
      .trim()
      .isLength({ min: 5 })
  ],
  checkValidation,
  studentController.createStudent
);

router.put(
  "/:studentId",
  isAuth,
  [
    body("name")
      .trim()
      .isLength({ min: 5 }),
    body("notes").trim(),
    body("email")
      .trim()
      .isEmail()
      .isLength({ min: 5 }),
    body("cellphone")
      .trim()
      .isLength({ min: 5 })
  ],
  checkValidation,
  studentController.updateStudent
);

//router.delete("/:studentId", studentController.deleteStudent);

module.exports = router;
