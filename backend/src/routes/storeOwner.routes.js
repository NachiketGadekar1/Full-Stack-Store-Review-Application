const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwner.controller');
const auth = require('../middleware/auth.middleware');

router.put('/password', auth('owner'), storeOwnerController.updatePassword);
router.get('/dashboard', auth('owner'), storeOwnerController.getStoreDashboard);

module.exports = router;
