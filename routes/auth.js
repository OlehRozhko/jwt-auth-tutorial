const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

// REGISTER
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  // LETS VALIDATE DATA BEFORE WE A USER
  const {error} = registerValidation(res.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  // Checking if the user is already in the database
  const emailExist = await User.findOne({email});
  if(emailExist) return res.status(400).send("Email already exists");

  // HASH passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create a new user
  const user = await User.create({name, email, password: hashedPassword});

  try {
    const savedUser = await user.save();
    res.status(200).send(savedUser);

  } catch (error) {
    res.status(400).send(error);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password }  = req.body;
  // LETS VALIDATE DATA BEFORE WE A USER
  const {error} = loginValidation(res.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Checking if the email exists 
  const user = await User.findOne({email});
  if(!user) return res.status(400).send("Email is not found");

  // Checking if the password is correcr
  const validPassword = await bcrypt.compare(password, user.password);
  if(!validPassword) return res.status(400).send("Invalid password");

  // Create and assign a token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);

  res.send('Logged in!!!');
})


module.exports = router;