const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', controller.getAll);
router.post('/', authenticate, authorize('ADMIN'), controller.create);

module.exports = router;
