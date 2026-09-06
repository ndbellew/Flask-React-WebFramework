
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import logo from "../../integritylogo.webp";
import { AuthContext } from '../../AuthContext';

const NavBar = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt={"Logo"} width={"45"} height={"45"} className={"d-inline-block align-top"} />
          Applicationn Web Template
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {!isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/Login">Login</Link>
            </li>
            )}
            {isAuthenticated && isAdmin && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
            </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/AboutUs">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ContactUs">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;