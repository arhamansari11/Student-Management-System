import React from "react";
import { Routes, Route } from "react-router-dom";
import Students from "../pages/Students";
import Dashboard from "../pages/Dashboard";
import Courses from "../pages/Courses";
import Attendance from "../pages/Attendance";
import Error from "../pages/Error";
import Navbar from "../components/Navbar";

const Routing = () => {
  return (
    <Navbar>
      <Routes>
        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Navbar>
  );
};

export default Routing;
