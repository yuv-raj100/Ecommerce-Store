const userModel = require('../models/userDetails')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const register = async (req,res)=>{
    const {username,email,password}=req.body;
    console.log(req.body);  
    try {
        const existingUser = await userModel.findOne({ email : email })
        if(existingUser){
            return res.status(400).json({message:"User already existed"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await userModel.create({
            username : username,
            email : email,
            password : hashedPassword,
        });

        const token = jwt.sign({email : result.email},process.env.SECRET_KEY)
        res.status(201).json({user:result,token:token})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Something went wrong"})
        }
}


const login = async (req,res)=>{
    const {email,password}=req.body;
    console.log(req.body)
    try {
        const existingUser = await userModel.findOne({ email : email })
        if(!existingUser){
            return res.status(404).json({message:"User not found"})
        }

        const matchPassword = await bcrypt.compare(password,existingUser.password);

        if(!matchPassword){
            res.status(400).json({message:"Invalid Credentials"});
        }

        const token = jwt.sign({email : existingUser.email},process.env.SECRET_KEY)
        res.status(201).json({token : token })

        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Something went wrong"})
        
        }
}

const profile = async (req,res)=>{
    const {token}=req.body;
    console.log(token);
    const decoded = jwt.decode(token);
    console.log(decoded);
    const existingUser = await userModel.findOne({ email : decoded.email })
    res.status(201).json({email : existingUser.email ,username:existingUser.username})
}



module.exports = {login,register,profile}