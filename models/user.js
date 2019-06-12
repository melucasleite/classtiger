const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isActive: { type: Boolean, default: true },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student"
    }
  ],
  lectures: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lecture"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
