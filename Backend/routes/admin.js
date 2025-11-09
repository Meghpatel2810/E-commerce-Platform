var express = require('express');
var router = express.Router();
const { login, verify } = require('../controllers/adminController');

router.post('/login', login);
router.get('/verify', verify, (req, res) => res.json({ ok: true }));

module.exports = router;

