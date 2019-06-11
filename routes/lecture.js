const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");
const lectureController = require("../controllers/lecture");

router.get("/", lectureController.getLectures);

router.post(
  "/",
  [
    body("title").trim(),
    body("dayOfWeek").isNumeric(),
    body("start").isISO8601(),
    body("end").isISO8601(),
    body("capacity")
      .trim()
      .isNumeric()
  ],
  lectureController.createLecture
);

router.put(
  "/:lectureId/students/:studentId",
  lectureController.addLectureStudent
);

router.delete(
  "/:lectureId/students/:studentId",
  lectureController.removeLectureStudent
);

module.exports = router;
