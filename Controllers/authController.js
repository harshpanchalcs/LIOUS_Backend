const catchAsync = require('../utils/catchAsync');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

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

exports.login = catchAsync(async (req, res, next) => {
  createSendToken(newUser, 201, res);
});

exports.varify = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
  .createHash('sha256')
  .update(req.body.otp)
  .digest('hex');

  const user = await User.findOne({
    email: req.body.email,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(res.status(400).json({message: "Token is invalid or has expired"}));
  }

  user.isVarified = true
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({validateBeforeSave:false})
  //res.status(200).json({  message: 'User varified successfully' }); 
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {

  const user = await User.findOne({ email : req.body.email }).select('+isVarified');
  if (user && !user.isVarified) {
    console.log("User already exist but not varified. Deleteing the user" + user.id + " " + user.email );
    user.deleteOne();
  }
  
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
    SendVerificationMail(req.body.email, res, next);
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
      const errorName = error.name;
      const errorMessage = error.message;
      res.status(500).json({ errorName, errorMessage});
    }
  }
});

const SendVerificationMail = catchAsync(async (email, res, next) => {
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log(email+ ": " + resetToken);

  try {
    const message = `Varifivation OTP is ${resetToken}.`;
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } 
  catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    const errorMessage = err.message;
    res.status(430).json({ 'There was an error sending the email. Try again later!': errorMessage });
  }
});