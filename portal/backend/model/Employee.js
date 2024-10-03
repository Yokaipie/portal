const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: String, required: true },
    imgBytes: { type: String, required: false }
});

// Create the model
const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
