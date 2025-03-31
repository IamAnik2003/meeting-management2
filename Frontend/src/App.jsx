import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Protected from "./Protected";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Tellusyourname from "./pages/Tellusyourname";
import { jwtDecode } from "jwt-decode";
import Profile from "./pages/Profile";
import axios from "axios";

function App() {
  const VITE_URL = import.meta.env.VITE_URL;

  return (
    <>
      
        <BrowserRouter>
          <Routes>
            <Route
              path="/dashboard"
              element={<Protected Components={Dashboard} VITE_URL={VITE_URL} />}
            />
            <Route
              path="/tell-us-your-name"
              element={<Protected Components={Tellusyourname} />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:userID" element={<Profile VITE_URL={VITE_URL}/>} />
          </Routes>
          <Toaster position="top-center" />
        </BrowserRouter>
      
    </>
  );
}

export default App;