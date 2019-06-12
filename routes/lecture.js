const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");
const lectureController = require("../controllers/lecture");
const checkValidation = require("../middleware/validation");
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, lectureController.getLectures);

router.post(
  "/",
  isAuth,
  [
    body("title").trim(),
    body("dayOfWeek").isNumeric(),
    body("start").isISO8601(),
    body("end").isISO8601(),
    body("capacity")
      .trim()
      .isNumeric()
  ],
  checkValidation,
  lectureController.createLecture
);

router.put(
  "/:lectureId/students/:studentId",
  isAuth,
  lectureController.addLectureStudent
);

router.delete(
  "/:lectureId/students/:studentId",
  isAuth,
  lectureController.removeLectureStudent
);

module.exports = router;
