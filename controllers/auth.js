const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET || "not_a_secret";

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email: email });
  try {
    if (userExists) {
      const error = new Error("There is already an user for this e-mail.");
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword
    });
    await user.save();
    res.status(200).json({
      message: "User created."
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  try {
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = new Error("Wrong Password.");
      error.statusCode = 401;
      throw error;
    } else {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString()
        },
        APP_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        token: token
      });
    }
  } catch (error) {
    next(error);
  }
};
