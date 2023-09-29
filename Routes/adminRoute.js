const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Admin Home Page');
  });

const organizationController = require('../Controllers/organizeController');
router
    .route('/organization')
    .post(organizationController.insertOrganization);

router
    .route('/unit')
    .post(organizationController.insertUnit);

router
    .route('/employee')
    .post(organizationController.insertEmployee);

module.exports = router;
