
const express = require('express');
const router = express.Router();
const organizemodel = require('./../Models/organizeModel');
// POST route for data insertion

exports.insertOrganization = (req, res) => {
    try {
      console.log("hiii");
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

exports.getOrganization = async (req, res) => {
    try {
      const data = await organizemodel.find({Organization: req.body.Name});
      res.json(data);
       }
    catch(error){
     res.status(500).json({ message: 'Error fetching data' });
    }
}

exports.insertUnit = async (req, res) => {
  try {
    const data = await organizemodel.findOne({Organization: req.body.Name});
    data.units.push({
      UnitName: req.body.UnitName,
      Address: req.body.Address,
      Contact: req.body.Contact,
      EmailId: req.body.EmailId,
    });
    data.save();
    res.json(data);
    //console.log(res);
  }
  catch(error){
     res.status(500).json({ message: 'Error fetching data' });
  }
   //res.send('Insert unit');  
}


exports.insertEmployee = (req, res) => {
    res.send('Insert employee');
}