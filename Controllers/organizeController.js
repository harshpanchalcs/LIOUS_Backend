
const express = require('express');
const router = express.Router();
const organizemodel = require('./../Models/organizeModel');
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

    // const express = require('express');
     const { MongoClient } = require('mongodb');
     const app = express();
    // const port = 3000;
    
    // app.use(express.json());
    
    const uri = 'mongodb://127.0.0.1:27017'; // Replace with your MongoDB URI
    
    // app.get('/checkField', async (req, res) => {
       const Organization = req.query.Organization;
    
      const client = new MongoClient(uri);
    
      try {
        client.connect();
    
        const database = client.db('LIOUS_Backend'); // Replace with your database name
        const collection = database.collection('organizations'); // Replace with your collection name
    
        const filter = {};
        filter[Organization] = { $Organization: String };
    
        const document =  collection.findOne(filter);
    
        if (document) {
          res.json({ message: `Field "${Organization}" exists in at least one document.` });
        } else {
          res.json({ message: `Field "${Organization}" does not exist in any document.` });
        }
      } catch (error) {
        console.error('Error checking field existence:', error);
        res.status(500).json({ error: 'An error occurred.' });
      }
    }
    
    // app.listen(port, () => {
    //   console.log(`Server is running on port ${port}`);
    // });
    
    
    //res.send('Insert unit');


exports.insertEmployee = (req, res) => {
    res.send('Insert employee');
}