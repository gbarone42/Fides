
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // console.log('Starting authentication...');
  const token = req.cookies.token;
  // console.log('Cookie token present:', !!token);
  
  /* if (!token) {
    return res.status(401).json({ 
      message: 'Authentication required', 
      redirectTo: '/login' 
    });
  } */

  if (!token) {
    // console.log('No token found in cookies');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // console.log('Attempting to verify token...');
    // console.log('SECRET_KEY present:', !!process.env.SECRET_KEY);

    const user = jwt.verify(token, process.env.SECRET_KEY);
    // console.log('Token verified successfully');
    // console.log('User from token:', user);

    req.user = user; // Add user info to request object
    next();
  } catch (err) {
    // console.log('Token verification failed:', err.message);
    // console.log('Error details:', err);
    
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
    // console.log('Employee route check. User role:', req.user.role);
    
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