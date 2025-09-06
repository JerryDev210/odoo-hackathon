import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
import MyListings from "./pages/MyListings";
import MyPurchases from "./pages/MyPurchases";
import Search from "./pages/Search";
import Addproducts from "./pages/Addproducts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/search" element={<Search />} />
        <Route path="/addproducts" element={<Addproducts/>}/>
      </Routes>
    </Router>
  );
}

export default App;
