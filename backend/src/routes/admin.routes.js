const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const { userValidationRules, validateRequest: validateUser } = require('../validators/user.validator');
const { storeValidationRules, validateRequest: validateStore } = require('../validators/store.validator');

router.post('/stores', auth('admin'), storeValidationRules(), validateStore, adminController.addStore);
router.post('/users', auth('admin'), userValidationRules(), validateUser, adminController.addUser);
router.get('/dashboard', auth('admin'), adminController.getDashboardStats);
router.get('/stores', auth('admin'), adminController.getStores);
router.get('/users', auth('admin'), adminController.getUsers);

module.exports = router;