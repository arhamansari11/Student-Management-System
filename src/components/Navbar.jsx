import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaBookOpen 
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import "../styles/navbar.css"; 


const Navbar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"/",
            name:"Dashboard",
            icon:<FaTh/>
        },
        {
            path:"/students",
            name:"Students",
            icon:<FaUserAlt/>
        },
        {
            path:"/attendance",
            name:"Attendance",
            icon:<FaRegChartBar/>
        },
        {
            path:"/courses",
            name:"Courses",
            icon:<FaBookOpen />
        }
    ]
    return (
        <div className="containe">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Admin Panne</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FaBars onClick={toggle} style={{cursor : 'pointer'}}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Navbar;