import express from 'express';
import bcrypt from 'bcrypt';
import errorHandler from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from '../models/user.js';

dotenv.config();

const router = express.Router();

router.post('/register', errorHandler, async (req, res, next) => {
  try {
    const { name, username, email, phone, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email is already taken' });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = new User({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
        phone: phone
      });

      await user.save();
      res.status(200).json({ message: 'User created successfully' });
    }

  } catch (error) {
    next(error);
  }
});

router.post('/login', errorHandler, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } else {
      const passwordMatch = bcrypt.compareSync(password, existingUser.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({
        id: existingUser._id,
        username: existingUser.username
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token: token });
    }
  } catch (error) {
    next(error);
  }
});

export default router;