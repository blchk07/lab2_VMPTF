const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Authorization header is required' });
  }

  const token = header.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'lab2_secret_key');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = { auth, allowRoles };
