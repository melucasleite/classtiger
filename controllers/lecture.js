const Lecture = require("../models/lecture");
const Student = require("../models/student");

exports.getLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find(
      {},
      "title capacity start end dayOfWeek students"
    );
    res.status(200).json({
      message: "",
      lectures: lectures
    });
  } catch (error) {
    next(error);
  }
};

exports.createLecture = async (req, res, next) => {
  const title = req.body.title;
  const dayOfWeek = req.body.dayOfWeek;
  const start = req.body.start;
  const end = req.body.end;
  const capacity = req.body.capacity;
  const lecture = new Lecture({
    title: title,
    dayOfWeek: dayOfWeek,
    start: start,
    end: end,
    capacity: capacity
  });
  try {
    await lecture.save();
    res.status(200).json({
      message: "Lecture created successfuly",
      lecture: lecture
    });
  } catch (err) {
    next(err);
  }
};

exports.addLectureStudent = async (req, res, next) => {
  const { lectureId, studentId } = req.params;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      const error = new Error("Lecture not found");
      error.statusCode = 404;
      return next(error);
    }
    lecture.students.addToSet(student);
    student.lectures.addToSet(lecture);
    await lecture.save();
    await student.save();
    res.status(200).json({ message: "Student added to lecture." });
  } catch (err) {
    next(err);
  }
};

exports.removeLectureStudent = async (req, res, next) => {
  const { lectureId, studentId } = req.params;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      const error = new Error("Lecture not found");
      error.statusCode = 404;
      return next(error);
    }
    lecture.students.pull(student);
    student.lectures.pull(lecture);
    await lecture.save();
    await student.save();
    res.status(200).json({ message: "Student removed from lecture." });
  } catch (err) {
    next(err);
  }
};
