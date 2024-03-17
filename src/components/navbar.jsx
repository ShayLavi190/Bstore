import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";
import "./navbar.css";

// Navbar component to display the navbar
export const Navbar = () => {
  // Function to logout the user
  const logout = () => {
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  return (
    <div className="navbar">
      <div className="brand">Bstore</div>
      <div className="links">
        <Link to="/shop"> Shop </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/myaccount"> My Account </Link>
        <Link to="/" onClick={logout}>Logout</Link>
        <Link to="/cart">
          <ShoppingCart className="cartIcon"  />
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
