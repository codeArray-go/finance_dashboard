export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "आपके पास उचित शक्तियां नहीं है!" });
    }
    next();
  };
};