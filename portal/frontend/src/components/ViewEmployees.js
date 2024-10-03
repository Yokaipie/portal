import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function ViewEmployees() {
    const [employees, setEmployees] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Add search query state
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
    const [snackbarSeverity, setSnackbarSeverity] = useState(''); // Snackbar severity


    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        mobileNo: '',
        designation: '',
        gender: '',
        course: [], // Ensure this is initialized as an empty array
        imgBytes: '',
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };



    // Function to fetch employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3000/listEmployees');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const formattedEmployees = data.employees.map((employee) => ({
                ...employee,
                course: employee.course ? employee.course.split(',') : []
            }));

            setEmployees(formattedEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (email) => {
        try {
            const response = await fetch(`http://localhost:3000/deleteEmployee/${email}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }
            setEmployees(employees.filter((employee) => employee.email !== email));
            handleSnackbar('Employee deleted successfully!', 'success'); // Success message
        } catch (error) {
            console.error('Error deleting employee:', error);
            handleSnackbar(error.message, 'error'); // Error message
        }
    };



    const handleEdit = (employee) => {
        setNewEmployee(employee);
        setEditMode(true);
        setOpen(true);
    };

    const handleCreateOpen = () => {
        setNewEmployee({
            name: '',
            email: '',
            mobileNo: '',
            designation: '',
            gender: '',
            course: [], // Resetting to an empty array
            imgBytes: ''
        });
        setEditMode(false);
        setOpen(true);
    };

    const handleCreateClose = () => {
        setOpen(false);
        setNewEmployee({name: '', email: '', mobileNo: '', designation: '', gender: '', course: '', imgBytes: ''});
    };

    const handleInputChange = (e) => {
        const {name, value, type, files} = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewEmployee((prev) => ({...prev, imgBytes: reader.result.split(',')[1]})); // Save Base64 part only
                };
                reader.readAsDataURL(file); // This converts the image to Base64
            } else {
                alert('Please upload a JPG or PNG image.');
            }
        } else {
            setNewEmployee((prev) => ({...prev, [name]: value}));
        }
    };

    const handleCreateSubmit = async () => {
        // Validate email and mobile number
        if (!validateEmail(newEmployee.email)) {
            handleSnackbar('Please enter a valid email address.', 'error');
            return;
        }
        if (!validateMobile(newEmployee.mobileNo)) {
            handleSnackbar('Please enter a valid mobile number (10 digits).', 'error');
            return;
        }
        setErrorMessage(''); // Clear error message if validation passes

        try {
            const employeeData = {...newEmployee, course: newEmployee.course.join(',')};
            const response = await fetch('http://localhost:3000/createEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) {
                throw new Error('Failed to create employee');
            }
            await response.json();
            await fetchEmployees(); // Refresh employee list after creation
            handleSnackbar('Employee created successfully!', 'success'); // Success message
            handleCreateClose();
        } catch (error) {
            console.error('Error creating employee:', error);
            handleSnackbar(error.message, 'error'); // Error message
        }
    };


    const handleEditSubmit = async () => {
        // Validate email and mobile number
        if (!validateEmail(newEmployee.email)) {
            handleSnackbar('Please enter a valid email address.', 'error');
            return;
        }
        if (!validateMobile(newEmployee.mobileNo)) {
            handleSnackbar('Please enter a valid mobile number (10 digits).', 'error');
            return;
        }
        setErrorMessage(''); // Clear error message if validation passes

        try {
            const employeeData = {...newEmployee, course: newEmployee.course.join(',')};
            const response = await fetch(`http://localhost:3000/updateEmployee/${newEmployee.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) {
                throw new Error('Failed to update employee');
            }
            await response.json();
            await fetchEmployees(); // Refresh employee list after updating
            handleSnackbar('Employee updated successfully!', 'success'); // Success message
            handleCreateClose();
        } catch (error) {
            console.error('Error updating employee:', error);
            handleSnackbar(error.message, 'error'); // Error message
        }
    };

    const handleCheckboxChange = (e) => {
        const {value, checked} = e.target;
        setNewEmployee((prev) => {
            const newcourse = checked
                ? [...prev.course, value] // Add course if checked
                : prev.course.filter((course) => course !== value); // Remove if unchecked
            return {...prev, course: newcourse};
        });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateMobile = (mobile) => {
        const regex = /^[0-9]{10}$/; // Adjust based on your mobile number format
        return regex.test(mobile);
    };


    const filteredEmployees = employees.filter(
        (employee) =>
            employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.mobileNo.includes(searchQuery)
    );

    if (loading) {
        return <Typography variant="h5">Loading...</Typography>;
    }

    return (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
            <Typography variant="h3">View Employees</Typography>
            <Box mt={4} display="flex" justifyContent="flex-end" style={{marginRight: '20px'}}>
                <TextField
                    label="Search Employees"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{marginRight: '20px', width: '300px'}} // Styling to make it look nice
                />
                <Button variant="contained" color="primary" onClick={handleCreateOpen}>
                    Create Employee
                </Button>
            </Box>
            <Box display="flex" justifyContent="flex-end" style={{marginTop: '20px', marginRight: '20px'}}>
                <Typography variant="subtitle1">
                    Total Employees: {employees.length}
                </Typography>
            </Box>


            <Box mt={2}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Mobile No</TableCell>
                                <TableCell>Designation</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.email}>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.mobileNo}</TableCell>
                                    <TableCell>{employee.designation}</TableCell>
                                    <TableCell>{employee.gender}</TableCell>
                                    <TableCell>{employee.course.join(', ')}</TableCell>
                                    <TableCell>
                                        {employee.imgBytes ? (
                                            <img
                                                src={`data:image/jpeg;base64,${employee.imgBytes}`} // or image/png based on the file type
                                                alt="Employee"
                                                style={{width: '50px', height: '50px', borderRadius: '4px'}}
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary"
                                                onClick={() => handleEdit(employee)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDelete(employee.email)}
                                            style={{marginLeft: '10px'}}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>


                    </Table>
                </TableContainer>
            </Box>

            {/* Create/Edit Employee Modal */}
            <Dialog open={open} onClose={handleCreateClose}>
                <DialogTitle>{editMode ? 'Edit Employee' : 'Create Employee'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newEmployee.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newEmployee.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="mobileNo"
                        label="Mobile No"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newEmployee.mobileNo}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense" variant="outlined">
                        <InputLabel>Designation</InputLabel>
                        <Select
                            name="designation"
                            value={newEmployee.designation}
                            onChange={handleInputChange}
                            label="Designation"
                        >
                            <MenuItem value="HR">HR</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="Sales">Sales</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl component="fieldset" margin="dense">
                        <RadioGroup
                            name="gender"
                            value={newEmployee.gender}
                            onChange={handleInputChange}
                            row
                        >
                            <FormControlLabel value="M" control={<Radio/>} label="Male"/>
                            <FormControlLabel value="F" control={<Radio/>} label="Female"/>
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="subtitle1" style={{marginTop: '16px'}}>course</Typography>
                    <FormControl component="fieldset">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newEmployee.course && newEmployee.course.includes('MCA')}
                                    onChange={handleCheckboxChange}
                                    value="MCA"
                                />
                            }
                            label="MCA"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newEmployee.course && newEmployee.course.includes('BCA')}
                                    onChange={handleCheckboxChange}
                                    value="BCA"
                                />
                            }
                            label="BCA"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newEmployee.course && newEmployee.course.includes('BSC')}
                                    onChange={handleCheckboxChange}
                                    value="BSC"
                                />
                            }
                            label="BSC"
                        />
                    </FormControl>
                    {newEmployee.imgBytes && (
                        <div>
                            <Typography variant="subtitle1" style={{marginTop: '16px'}}>Existing Image</Typography>
                            <img
                                src={`data:image/jpeg;base64,${newEmployee.imgBytes}`} // or image/png based on the file type
                                alt="Employee"
                                style={{width: '50px', height: '50px', borderRadius: '4px'}}
                            />
                        </div>
                    )}
                    <TextField
                        margin="dense"
                        name="imgBytes"
                        type="file"
                        fullWidth
                        variant="outlined"
                        onChange={handleInputChange}
                    />
                </DialogContent>
                {errorMessage && (
                    <Typography variant="body2" color="error">
                        {errorMessage}
                    </Typography>
                )}
                <DialogActions>
                    <Button onClick={handleCreateClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={editMode ? handleEditSubmit : handleCreateSubmit} color="primary">
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </div>
    );
}

export default ViewEmployees;
