const organizemodel = require('../models/organizeModel');
// POST route for data insertion

exports.insertOrganization = (req, res) => {
    try {
      
      const newData = new organizemodel({
        Organization: req.body.Name,
        Industry: req.body.Industry,
        EmailId: req.body.Email,
        Contact: req.body.ContactNumber,
        CIN: req.body.CIN,
      });
  
      newData.save();
  
      console.log("inserted successfully");
      res.status(201).json({
        message: 'Data inserted successfully',
        data: newData,
      });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'Error inserting data' });
    }
}

exports.insertUnit = (req, res) => {
    res.send('Admin Home Page');
}

exports.insertEmployee = (req, res) => {
    res.send('Admin Home Page');
}