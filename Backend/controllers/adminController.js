const Admin = require('../models/Admin');

// Seed a default admin if missing
exports.ensureDefaultAdmin = async () => {
  const exists = await Admin.findOne({ username: 'Aum Shah' });
  if (!exists) {
    await Admin.create({ username: 'Aum Shah', password: 'bobby26' });
    console.log('Default admin created');
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  const admin = await Admin.findOne({ username });
  if (!admin || admin.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
  // simple session via header token for now (no JWT), issue a static token
  const token = 'admintoken-' + admin._id.toString();
  return res.json({ token });
}

exports.verify = (req, res, next) => {
  const auth = req.headers['x-admin-token'];
  if (!auth || !auth.startsWith('admintoken-')) return res.status(401).json({ message: 'Admin not authenticated' });
  next();
}

