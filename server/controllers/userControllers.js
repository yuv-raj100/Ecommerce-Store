const userModel = require('../models/userDetails')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const result = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ email: result.email }, process.env.SECRET_KEY);
    
    res.status(201).json({ user: {username,email}, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const username=existingUser.username
    const token = jwt.sign({ email: existingUser.email}, process.env.SECRET_KEY);

    // Return the token
    return res.status(200).json({ token, user:{email,username} });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};


const profile = async (req,res)=>{
    const {token}=req.body;
    const decoded = jwt.decode(token);
    const existingUser = await userModel.findOne({ email : decoded.email })
    res.status(201).json({email : existingUser.email ,username:existingUser.username})
}



module.exports = {login,register,profile}