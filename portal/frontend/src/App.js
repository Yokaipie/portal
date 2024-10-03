import React from 'react';
import {BrowserRouter as Router, Route, Routes, Link, Navigate} from 'react-router-dom';
import Navbar from "./components/navbar";
import Login from "./components/Login";
import AdminPortal from "./components/AdminPortal";
import ViewEmployees from "./components/ViewEmployees";

function App() {
    return (
        <Router>
            <Navbar></Navbar>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/viewEmployees" element={<ViewEmployees />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
