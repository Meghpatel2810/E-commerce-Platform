var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const { list, get, create, update, remove, categories } = require('../controllers/productController');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '..', 'public', 'images');
    try {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
    } catch (e) {
      return cb(e);
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `prod-${unique}${ext}`);
  }
});
const upload = multer({ storage });

router.get('/', list);
router.get('/:id', get);
router.post('/', upload.single('image'), create);
router.put('/:id', upload.single('image'), update);
router.delete('/:id', remove);
router.get('/meta/categories/list', categories);

module.exports = router;

