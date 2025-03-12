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
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email: email }] });

    if (existingUser) {
      return res.status(400).json({ message: 'email is already taken' });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone
      });

      await user.save();
      res.status(200).json({ message: 'User created successfully' });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
});

router.post('/login', errorHandler, async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } else {
      const passwordMatch = bcrypt.compareSync(password, existingUser.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({
        id: existingUser._id,
        email: existingUser.email
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ 
        message: 'Login successful', 
        token: token,
        userName: existingUser.name // Include user name in the response
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
});

export default router;