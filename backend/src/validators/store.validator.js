const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const storeValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters.'),
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address.'),
    body('address')
      .isLength({ max: 400 })
      .withMessage('Address must be a maximum of 400 characters.'),
  ];
};

module.exports = {
  storeValidationRules,
  validateRequest,
};
