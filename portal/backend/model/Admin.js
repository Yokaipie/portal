const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create the model
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
