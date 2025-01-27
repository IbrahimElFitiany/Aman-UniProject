const jwt = require('jsonwebtoken');

const secretKey = 'hD9!k4P#2&xXl7W@0zM$3UvT*8gQ1Ns';

const generateToken = (user) => {
  return jwt.sign(user, secretKey, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).send('A token is required for authentication');
  }

  const token = authHeader.split(' ')[1]; // Split to handle the 'Bearer' part

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = {
  generateToken,
  verifyToken
};
