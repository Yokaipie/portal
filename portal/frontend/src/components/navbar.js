import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Cookies from "js-cookie"; // Import js-cookie

function Navbar() {
    const navigate = useNavigate(); // Hook to navigate
    const isLoggedIn = Cookies.get("isLoggedIn"); // Check if the user is logged in
    const username = Cookies.get("username"); // Retrieve the username from cookies

    // Ensure redirection to login only happens after component mount
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); // Redirect to the login page if not logged in
        }
    }, [isLoggedIn, navigate]); // Dependencies for the effect

    const handleLogout = () => {
        Cookies.remove("isLoggedIn"); // Remove the cookie
        Cookies.remove("username"); // Remove the cookie
        navigate("/login"); // Navigate to the login page
    };

    const handleHomeClick = () => {
        navigate("/admin"); // Redirect to the admin page
    };

    const handleViewEmployees = () => {
        navigate("/viewEmployees"); // Navigate to the view employees page
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                        Logo
                    </Typography>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        {isLoggedIn && username && (
                            <>
                                <Typography variant="body1" color="inherit" sx={{ marginRight: 2 }}>
                                    Welcome, {username}!
                                </Typography>
                                <Button color="inherit" onClick={handleHomeClick} sx={{ marginRight: 2 }}>
                                    Home
                                </Button>
                                <Button color="inherit" onClick={handleViewEmployees} sx={{ marginRight: 2 }}>
                                    View Employees
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Navbar;
