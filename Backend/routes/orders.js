var express = require('express');
var router = express.Router();
const { create, mine, all, updateStatus, cancel } = require('../controllers/orderController');

router.post('/', create);
router.get('/mine', mine);
router.get('/', all);
router.put('/:id/status', updateStatus);
router.put('/:id/cancel', cancel);

module.exports = router;

