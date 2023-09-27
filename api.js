const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.send('Hello, Express!');
});

const adminRoutes = require('./Routes/adminRoute');
router.use('/admin', adminRoutes);

const userRoutes = require('./Routes/userRoute');
router.use('/user', userRoutes);

module.exports = router;
