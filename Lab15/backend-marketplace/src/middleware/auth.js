const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, { include: Role });
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.Role) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    if (!roles.includes(req.user.Role.nombre)) {
      return res.status(403).json({ error: 'No tienes permisos para esta accion' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
