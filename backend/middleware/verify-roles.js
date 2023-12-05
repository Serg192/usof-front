const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.userRole) return res.sendStatus(401);
    const haveAccess = [...allowedRoles].includes(req.user.userRole);
    if (!haveAccess) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
