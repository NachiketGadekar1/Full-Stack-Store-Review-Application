const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const userValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters.'),
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address.'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters.')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/)
      .withMessage('Password must contain at least one uppercase letter and one special character.'),
    body('address')
      .isLength({ max: 400 })
      .withMessage('Address must be a maximum of 400 characters.'),
  ];
};

const passwordUpdateValidationRules = () => {
  return [
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('New password must be between 8 and 16 characters.')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$&*]).*$/)
      .withMessage('New password must contain at least one uppercase letter and one special character.'),
  ];
};

module.exports = {
  userValidationRules,
  passwordUpdateValidationRules,
  validateRequest,
};
