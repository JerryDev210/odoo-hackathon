import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Addproducts from "./pages/Addproducts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/addproducts" element={<Addproducts/>}/>
      </Routes>
    </Router>
  );
}

export default App;
