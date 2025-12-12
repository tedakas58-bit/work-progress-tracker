import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Alternative name for consistency
export const authenticateToken = authenticate;

export const authorizeMainBranch = (req, res, next) => {
  if (req.user.role !== 'main_branch') {
    return res.status(403).json({ error: 'Access denied. Main branch only.' });
  }
  next();
};

export const authorizeBranchUser = (req, res, next) => {
  if (req.user.role !== 'branch_user') {
    return res.status(403).json({ error: 'Access denied. Branch users only.' });
  }
  next();
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Generic role authorization
export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. ${role} role required.` });
    }
    next();
  };
};

// Allow multiple roles
export const requireAnyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. One of these roles required: ${roles.join(', ')}` });
    }
    next();
  };
};