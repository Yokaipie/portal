// src/AdminPortal.js
import React from 'react';
import { Typography, Box } from '@mui/material';
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom"; // Import js-cookie

function AdminPortal() {
    const navigate = useNavigate(); // Hook to navigate
    const isLoggedIn = Cookies.get('isLoggedIn'); // Check if the user is logged in

    if (!isLoggedIn) {
        navigate('/login'); // Redirect to the login page if not logged in
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h3">Welcome to Admin Portal</Typography>
            <Box mt={4}> {/* Adds margin to the top of the buttons */}
            </Box>
        </div>
    );
}

export default AdminPortal;
