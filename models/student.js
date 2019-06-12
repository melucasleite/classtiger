const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    _author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String
    },
    cellphone: {
      type: String
    },
    notes: {
      type: String
    },
    email: {
      type: String,
      unique: true
    },
    deletedAt: {
      type: Date
    },
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
