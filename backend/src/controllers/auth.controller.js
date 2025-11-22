const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user - role is ALWAYS 'user' for public registration
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: 'user',
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`Login failed: User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error(`Login failed: Incorrect password for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log(`Login successful for email: ${email}`);
    res.json({ token });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
};
