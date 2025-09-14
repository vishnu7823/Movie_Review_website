// controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please provide username, email and password');
  }
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    res.status(400);
    throw new Error('Email or username already in use');
  }
  const user = await User.create({ username, email, password });
  res.status(201).json({ user: user.toJSON(), token: generateToken(user._id) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.comparePassword(password))) {
    res.json({ user: user.toJSON(), token: generateToken(user._id) });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
