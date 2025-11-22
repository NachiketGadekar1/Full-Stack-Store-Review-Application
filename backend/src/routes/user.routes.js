const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { passwordUpdateValidationRules, validateRequest } = require('../validators/user.validator');

router.put('/password', auth(), passwordUpdateValidationRules(), validateRequest, userController.updatePassword);
router.get('/stores', auth(), userController.getStores);
router.post('/ratings', auth(), userController.submitOrUpdateRating);

module.exports = router;
