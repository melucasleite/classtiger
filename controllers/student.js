const Student = require("../models/student");

exports.getStudents = async (req, res, next) => {
  const userId = req.userId;
  try {
    const students = await Student.find({
      deletedAt: null,
      _author: userId
    });
    res.status(200).json({
      message: "",
      students: students
    });
  } catch (err) {
    next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  const { name, email, cellphone } = req.body;
  const userId = req.userId;
  try {
    const studentExists = await Student.findOne({
      email: email
    });
    if (studentExists) {
      if (studentExists.deletedAt) {
        studentExists.deletedAt = undefined;
        await studentExists.save();
        res.status(200).json({
          message:
            "Found a deleted student with this e-mail. Just undeleted it.",
          student: studentExists
        });
      } else {
        res.status(422).json({
          message: "A student already exists with this e-mail.",
          student: studentExists
        });
      }
      await studentExists.save();
    } else {
      const student = new Student({
        _author: userId,
        name: name,
        email: email,
        cellphone: cellphone,
        notes: ""
      });
      await student.save();
      res.status(200).json({
        message: "Student created successfully.",
        student: student
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  const studentId = req.params.studentId;
  const userId = req.userId;
  const { name, email, cellphone, notes } = req.body;
  try {
    const student = await Student.findOne({ _id: studentId, _author: userId });
    if (!student) {
      const error = new Error("Student not found.");
      error.statusCode = 404;
      return next(error);
    }
    student.name = name;
    student.cellphone = cellphone;
    student.email = email;
    student.notes = notes;
    const result = await student.save();
    res.status(200).json({ message: "Student updated!", student: result });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  const studentId = req.params.studentId;
  try {
    const student = await Student.findOne({ _id: studentId, _author: userId });
    if (!student) {
      const error = new Error("Student not found.");
      error.statusCode = 404;
      return next(error);
    }
    student.deletedAt = new Date();
    const result = await student.save();
    res.status(200).json({ message: "Student deleted.", student: result });
  } catch (err) {
    next(err);
  }
};
