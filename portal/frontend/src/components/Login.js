import { Box, Button, Card, CardContent, TextField, Typography, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

function Login() {
    const [open, setOpen] = useState(false); // State to manage Snackbar
    const [message, setMessage] = useState(""); // State to hold the message
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const username = event.target.username.value; // Access the username field by name
        const password = event.target.password.value; // Access the password field by name

        // Call the validate API
        try {
            const response = await fetch("http://localhost:3000/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            // Check if the login was successful
            if (data.valid) {
                // If authentication is successful, navigate to admin page
                Cookies.set('isLoggedIn', 'true', { expires: 7 }); // Expires in 7 days
                Cookies.set('username', username, { expires: 7 }); // Expires in 7 days
                navigate('/admin'); // Redirect to admin page
            } else {
                // Show error message if credentials are invalid
                setMessage("Invalid Credentials");
                setOpen(true); // Open the Snackbar
            }
        } catch (error) {
            console.error("Error during login:", error);
            setMessage("An error occurred. Please try again.");
            setOpen(true); // Open the Snackbar
        }
    };

    const handleClose = () => {
        setOpen(false); // Close the Snackbar
    };

    return (
        <div>
            <Box
                className="App"
                sx={{
                    display: 'flex',
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center',      // Center vertically
                    height: '100vh',           // Full viewport height
                }}
            >
                <Card style={{ width: '300px' }}>
                    <CardContent>
                        <Typography variant="h5" component="h1" align="center">Login Page</Typography>
                        <form onSubmit={handleLogin}>
                            <TextField
                                name="username" // Add name attribute
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                name="password" // Add name attribute
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>

            {/* Snackbar for displaying messages */}
            <Snackbar
                open={open}
                onClose={handleClose}
                message={message}
                autoHideDuration={6000} // Auto-hide after 6 seconds
            />
        </div>
    );
}

export default Login;
