import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Students from "../pages/Students"
import Dashboard from "../pages/Dashboard"
import Courses from "../pages/Courses"
import Attendance from "../pages/Attendance"
import Error from "../pages/Error"



const Routing = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Dashboard/>}/>
        <Route path='/students' element={<Students/>}/>
        <Route path='/attendance' element={<Attendance/>}/>
        <Route path='/courses' element={<Courses/>}/>
        <Route path='*' element={<Error/>}/>
      </Route>
    </Routes>
  )
}

export default Routing