const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    //if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    //res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

exports.signup = catchAsync(async (req, res, next) => {

  try {
    const newUser = new User({
      companyName: req.body.companyName,
      companyCinNo: req.body.companyCinNo,
      fullName: req.body.fullName,
      contactNo: req.body.contactNo,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    await newUser.save();
    //createSendToken(newUser, 201, res);
    res.send('User Login Page');
  } 
  catch (error) {
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ errors });
    } 
    else if (error.code === 11000 && error.keyPattern.email) {
      res.status(400).json({ error: 'Email already exists' });
    } 
    else {
      // Handle other errors
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }

});