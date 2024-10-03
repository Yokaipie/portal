const express = require('express');
const bodyParser = require('body-parser');
const Employee = require("./model/Employee");
const Admin = require("./model/Admin"); // Ensure this is the correct path for your Admin model
const connectDB = require('./client/mongoClient');
const cors = require('cors'); // Import cors

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Connect to MongoDB in an async function
const startServer = async () => {
    try {
        await connectDB(); // Await the connection
        console.log('MongoDB connected successfully');

        const port = 3000;

        app.post('/createEmployee', async (req, res) => {
            try {
                const { name, email, mobileNo, designation, gender, course, imgBytes } = req.body;

                const newEmployee = new Employee({
                    name,
                    email,
                    mobileNo,
                    designation,
                    gender,
                    course,
                    imgBytes
                });

                const savedEmployee = await newEmployee.save();

                res.status(201).json({
                    message: 'Employee created successfully',
                    employee: savedEmployee, // Optional: include the saved employee data in the response
                });
            } catch (err) {
                console.error('Error creating employee:', err);
                res.status(500).json({
                    message: 'Failed to create employee',
                });
            }
        });

        app.put('/updateEmployee/:email', async (req, res) => {
            try {
                const { email } = req.params; // Get the email from the URL parameters
                const updatedData = req.body; // Get the updated data from the request body

                // Find the employee by email and update their details
                const updatedEmployee = await Employee.findOneAndUpdate(
                    { email }, // Search condition
                    updatedData, // Updated data
                    { new: true, runValidators: true } // Options: return the updated document and validate updates
                );

                if (!updatedEmployee) {
                    return res.status(404).json({ message: 'Employee not found.' });
                }

                res.status(200).json({
                    message: 'Employee updated successfully',
                    employee: updatedEmployee, // Optional: include the updated employee data in the response
                });
            } catch (err) {
                console.error('Error updating employee:', err);
                res.status(500).json({
                    message: 'Failed to update employee',
                });
            }
        });

        app.get('/listEmployees', async (req, res) => {
            try {
                const employees = await Employee.find(); // Fetch all employees

                res.status(200).json({
                    message: 'Employees retrieved successfully',
                    employees, // Return the list of employees
                });
            } catch (err) {
                console.error('Error retrieving employees:', err);
                res.status(500).json({
                    message: 'Failed to retrieve employees',
                });
            }
        });

        app.delete('/deleteEmployee/:email', async (req, res) => {
            try {
                const { email } = req.params; // Get the email from the URL parameters

                // Find the employee by email and delete them
                const deletedEmployee = await Employee.findOneAndDelete({ email });

                if (!deletedEmployee) {
                    return res.status(404).json({ message: 'Employee not found.' });
                }

                res.status(200).json({
                    message: 'Employee deleted successfully',
                    employee: deletedEmployee, // Optional: include the deleted employee data in the response
                });
            } catch (err) {
                console.error('Error deleting employee:', err);
                res.status(500).json({
                    message: 'Failed to delete employee',
                });
            }
        });

        // New validate endpoint
        app.post('/validate', async (req, res) => {
            try {
                const { username, password } = req.body; // Get username and password from request body

                // Check if an admin with the given username exists
                const admin = await Admin.findOne({ username });

                // If admin does not exist, return false
                if (!admin) {
                    return res.status(404).json({ valid: false });
                }

                // Validate the password (assuming you are storing hashed passwords)
                const isPasswordValid = password === admin.password; // Adjust this if using hashed passwords

                res.status(200).json({ valid: isPasswordValid }); // Return true/false based on validation
            } catch (err) {
                console.error('Error validating admin credentials:', err);
                res.status(500).json({ message: 'Failed to validate credentials' });
            }
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process if there's an error
    }
};

// Start the server
startServer();
