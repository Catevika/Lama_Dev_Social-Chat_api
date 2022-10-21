import express from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) res.status(404).json('User not found');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).json('Wrong password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export default router;
