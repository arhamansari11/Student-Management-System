// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { Dashboard, People, Book, Assignment } from "@mui/icons-material";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <div
              className="row"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="col-7">
                <b>Muhammad Arham</b>
              </div>
              <div className="col-7">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Dashboard />
                  <span>Dashboard</span>
                </Link>
              </div>
              <div className="col-7">
                <Link to="/students" style={{ textDecoration: "none" }}>
                  <People />
                  <span>Students</span>
                </Link>
              </div>
              <div className="col-7">
                <Link to="/courses" style={{ textDecoration: "none" }}>
                  <Book />
                  <span>Courses</span>
                </Link>
              </div>
              <div className="col-7">
                <Link to="/attendance" style={{ textDecoration: "none" }}>
                  <Assignment />
                  <span>Attendance</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
