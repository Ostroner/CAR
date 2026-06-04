import { AppError } from '../utils/AppError.js';

export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return next(new AppError('You must be logged in to access this resource.', 401, 'UNAUTHENTICATED'));
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session?.user) {
      return next(new AppError('You must be logged in to access this resource.', 401, 'UNAUTHENTICATED'));
    }
    if (!roles.includes(req.session.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
    }
    next();
  };
}
