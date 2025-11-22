const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const { userValidationRules, validateRequest } = require('../validators/user.validator');

router.post('/register', userValidationRules(), validateRequest, authController.register);
router.post('/login', authController.login);

// A protected route for testing
router.get('/profile', auth(), (req, res) => {
  res.json(req.user);
});

module.exports = router;
