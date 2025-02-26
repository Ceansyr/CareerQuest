import express from 'express';
import express from 'express';
import bcrypt from 'bcrypt';
import errorHandler from '../middleware/errorHandler';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const router = express.Router();

router.post('/register', errorHandler, async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const existingUser = await username.findOne({ $or: [{ email: email }, { username: username }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email is already taken' });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);

      const user = new User({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
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
    errorHandler(error, req, res);
  }
});

export default router;