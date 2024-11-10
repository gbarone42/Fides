
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Authentication required', 
      redirectTo: '/login' 
    });
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user; // Add user info to request object
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('token');
      return res.status(401).json({ 
        message: 'Session expired', 
        redirectTo: '/login' 
      });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};


// Protected routes middleware
const protectedRoute = (req, res, next) => {
  try {
    // Check if user has necessary role/permissions
    if (req.user.role !== 'employee') {
      return res.status(403).json({ 
        message: 'Access denied', 
        redirectTo: '/login' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticateToken, protectedRoute };  // Export the functions