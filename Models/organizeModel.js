const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    EmployeeId: Number,
    EmployeeName: String,
    contact: String,
    Address:String,
    ExpiryDate:Date,
    MedicalDocuments:String,
    EmailId:String,
    CIN:String,
});
const unitSchema = new mongoose.Schema({
    UnitName: String,
    Address:String,
    Contact:String,
    Employees: [employeeSchema],
    ActiveRequests:Number,
    ExpiryDate:Date,
    Status:Boolean,
    JoiningDate:Date,
    TotalRequests:Number,
    Location: String,
    EmailId:String,
});
const organizeSchema = new mongoose.Schema({
    Organization:{
        type:String,
        required:[true,'Organization can not be empty!']
    },
    Contact:Number,
    Industry:String,
    units: [unitSchema],
    TotalRequests: Number,
    Datejoined: Date,
    Status: Boolean,
    ExpiryDate:Date,
    EmailId:String,
    Location:String,
    CIN:String,
});

module.exports = mongoose.model('organization', organizeSchema);
