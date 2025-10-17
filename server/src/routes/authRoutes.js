const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash
      });

      const token = generateToken(user._id);

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Register error:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ 
        message: 'Failed to register user',
        detail: error.message 
      });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ 
        message: 'Failed to login',
        detail: error.message 
      });
    }
  }
);

router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
