import React, { useState } from "react";
import {
  FaTh,
  FaBars,
  FaUserAlt,
  FaRegChartBar,
  FaBookOpen,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaTh />,
    },
    {
      path: "/students",
      name: "Students",
      icon: <FaUserAlt />,
    },
    {
      path: "/courses",
      name: "Courses",
      icon: <FaBookOpen />,
    },
    {
      path: "/attendance",
      name: "Attendance",
      icon: <FaRegChartBar />,
    },
  ];
  return (
    <div className="containe">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 className="logo">Admin Pannel</h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} style={{ cursor: "pointer" }} />
          </div>
        </div>

        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassName="active"
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Navbar;
