const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role });
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isWholesaleAccount: user.isWholesaleAccount
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isWholesaleAccount: user.isWholesaleAccount
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Temporary: return a mock profile if email is provided, else 400
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'email query required temporarily' });
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'email query required' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { name, phone, address } = req.body;
    
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address) {
      user.address = {
        line1: address.line1 || user.address?.line1 || '',
        line2: address.line2 || user.address?.line2 || '',
        city: address.city || user.address?.city || '',
        state: address.state || user.address?.state || '',
        postalCode: address.postalCode || user.address?.postalCode || '',
        country: address.country || user.address?.country || ''
      };
    }
    
    await user.save();
    const updated = await User.findOne({ email }).select('-password');
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

