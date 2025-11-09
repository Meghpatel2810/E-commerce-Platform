var express = require('express');
var router = express.Router();
const { quote, place, list } = require('../controllers/bulkController');

router.post('/quote', quote); // compute tiered pricing
router.post('/place', place); // place bulk order (updates stock)
router.get('/', list);       // list all bulk orders (admin)

module.exports = router;

