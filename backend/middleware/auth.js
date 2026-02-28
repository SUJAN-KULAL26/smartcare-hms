const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get Authorization header
  const header = req.headers.authorization;

  // If no header present
  if (!header) {
    return res.status(401).json({
      error: "Access Denied. No token provided."
    });
  }

  // Support both:
  // 1. "Bearer token"
  // 2. "token"
  let token;

  if (header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else {
    token = header;
  }

  try {
  console.log("JWT_SECRET used:", process.env.JWT_SECRET);
  console.log("TOKEN RECEIVED:", token);

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  req.user = verified;
  next();
} catch (err) {
    return res.status(401).json({
      error: "Invalid or Expired Token"
    });
  }
};