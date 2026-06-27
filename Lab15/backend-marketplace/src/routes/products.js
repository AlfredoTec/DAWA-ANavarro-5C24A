const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('ADMIN'), controller.create);
router.put('/:id', authenticate, authorize('ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.remove);

module.exports = router;
