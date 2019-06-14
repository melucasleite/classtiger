const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET || "not_a_secret";
function isAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Missing Authorization Header.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, APP_SECRET);
    req.userId = decodedToken.userId;
    next();
    return decodedToken;
  } catch {
    const error = new Error("Not Authenticated.");
    error.statusCode = 401;
    next(error);
  }
}

module.exports = isAuth;
