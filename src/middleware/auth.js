const jwt = require('jsonwebtoken');

// Lấy token từ header Authorization: Bearer <token>
function extractToken(req) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');
  if (/^Bearer$/i.test(scheme) && token) return token;
return req.cookies?.access_token || null;

}

// Chỉ yêu cầu đăng nhập (có token hợp lệ)
function requireLogin(req, res, next) {
  if (req.method === 'OPTIONS') return next();

  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
    const payload = jwt.verify(token, process.env.JWT_SECRET); // { sdt, role, iat, exp }
    req.user = payload;
    return next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Yêu cầu vai trò cụ thể (ví dụ: ['admin'])
function requireRoles(roles = []) {
  const must = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      if (must.length && !must.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden: admin only' });
      }
      return next();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}


const requireAdmin = requireRoles(['admin']);

module.exports = { requireLogin, requireRoles, requireAdmin };