
// Yêu cầu đã đăng nhập
function requireLogin(req, res, next) {
  
  if (req.method === 'OPTIONS') return next();

  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// Yêu cầu vai trò cụ thể 
function requireRoles(roles = []) {
  const must = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const role = req.session.user.role;
    if (must.length && !must.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }

    next();
  };
}

// chỉ admin
const requireAdmin = requireRoles(['admin']);

module.exports = { requireLogin, requireRoles, requireAdmin };
