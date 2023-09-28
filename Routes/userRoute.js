const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.get('/', (req, res) => {
    res.send('User Home Page');
  });

router
  .route('/signup')
  .post(authController.signup);

module.exports = router;
