import { AppError } from '../utils/AppError.js';
import { cleanObject } from '../utils/sanitize.js';

export const validate = (schema, target = 'body') => (req, res, next) => {
  const input = cleanObject(req[target]);
  const { error, value } = schema.validate(input, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    return next(new AppError('Validation failed', 422, 'VALIDATION_ERROR', error.details.map(d => d.message)));
  }

  req[target] = value;
  next();
};
