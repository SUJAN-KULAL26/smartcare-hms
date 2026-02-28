module.exports = function (allowedRoles) {
  return function (req, res, next) {

    // If user not attached by auth middleware
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized - No user data found"
      });
    }

    // If role missing
    if (!req.user.role) {
      return res.status(403).json({
        error: "Access Denied - Role not found"
      });
    }

    // If role not allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission to perform this action"
      });
    }

    next();
  };
};