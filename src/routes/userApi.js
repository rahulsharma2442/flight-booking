
const express = require('express');
const {User} = require('../modles/user');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const {userAuth} = require('../middlewears/userMiddleWear');
const userRouter = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
const envEmail = process.env.EMAIL;
const envEmailPassword = process.env.EMAIL_PASSWORD;
const environment = process.env.ENV;
userRouter.get('/allUsers',userAuth,async(req,res)=>{
  
    try{
        const result = await User.find({});
        return res.status(200).send({msg:result});
    }
    catch(error){
        console.log('error is present',error);
        return {msg:error.message};
    }
});

userRouter.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, dateOfBirth, phoneNumber, address } = req.body;

    // Check if user already exists
    const alreadyPresent = await User.findOne({ email });
    if (alreadyPresent) {
      return res.status(403).send({ msg: "User already present" });
    }

    // Generate email verification token
    const secret =jwtSecret;
    const emailToken = jwt.sign({ email }, secret, { expiresIn: '1h' });

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envEmail, // Use environment variables
        pass: envEmailPassword,
      },
    });

    // Email verification link
    const verificationLink = `http://localhost:7777/api/Users/verify-email?token=${emailToken}`;
    const mailOptions = {
      from: envEmail,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Save user to the database with `isVerified` set to false
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      gender,
      dateOfBirth,
      phoneNumber,
      address,
      isVerified: false,
    });
    await newUser.save();

    return res.status(201).json({ msg: 'Registration successful! Please check your email to verify your account.' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Something went wrong " + error.message });
  }
});

userRouter.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send({ msg: "Invalid or missing token" });
    }

    const secret = jwtSecret;

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).send({ msg: "Invalid or expired token" });
    }

    const email = decoded.email;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ msg: "User already verified" });
    }

    // Update `isVerified` flag
    user.isVerified = true;
    await user.save();

    return res.status(200).send(`
      <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: green;">Email Verified Successfully!</h1>
        <p style="font-size: 18px; color: #333;">You can now log in to your account.</p>
      </div>
    `);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
});

userRouter.post('/login',async(req,res)=>{
 
  try{
    const {email,password} = req.body;
    if(!email){
      return res.status(401).json({msg:"combination of ID and password do not exit"});
    }
  
   
    const user = await User.findOne({ email: email });
  
    
    if(!user){
      return res.status(401).send({msg:"combination of ID and password do not exit"});
    }
   
    if(password!==user.password){
      return res.status(401).send({msg:"combination of ID and password do not exit"});
    }
    
    const secret = jwtSecret;
    let jwtValue = {id:user._id};
    const token =  jwt.sign(JSON.stringify(jwtValue),secret);
    res.cookie('authToken',token);
     return res.status(201).json({
       message: 'Login Successfully',
       user: user,
     });
  }
  catch(error){
    return res.status(400).send({msg:"Login Failed!"})
  }
});
userRouter.post('/logout', (req, res) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
    });

    return res.status(200).send({ msg: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).send({ msg: 'Something went wrong during logout' });
  }
});

module.exports = {userRouter}