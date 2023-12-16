import React from "react";
import { Link } from "react-router-dom";
import { Dashboard, People, Book, Assignment } from "@mui/icons-material";
import "../styles/navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-3 col-sm-4 col-5">
            <div
              className="row bg-clr"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="col-11 icons">
                <b style={{fontSize : "19px"}}>Muhammad Arham</b>
              </div>
              <div className="col-7 icons">
                <Link to="/" className="nav-link">
                  <Dashboard />
                  <span>Dashboard</span>
                </Link>
              </div>
              <div className="col-7 icons">
                <Link to="/students" className="nav-link">
                  <People />
                  <span>Students</span>
                </Link>
              </div>
              <div className="col-7 icons">
                <Link to="/courses" className="nav-link">
                  <Book />
                  <span>Courses</span>
                </Link>
              </div>
              <div className="col-7 icons">
                <Link to="/attendance" className="nav-link">
                  <Assignment />
                  <span>Attendance</span>
                </Link>
              </div>
              <div className="col-7 icons">

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
