const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Authentication failed: No token provided.' });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Authentication failed: Invalid token.' });
    }
  };
};

module.exports = auth;
