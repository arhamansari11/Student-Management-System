import React, { useState, useEffect, useRef } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const collectionStudents = collection(db, "students");
  const collectionCourses = collection(db, "courses");
  const collectionAttendance = collection(db, "attendance");

  const getStudent = async () => {
    try {
      const data = await getDocs(collectionStudents);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudents(filteredData);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const getCourses = async () => {
    try {
      const data = await getDocs(collectionCourses);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCourses(filteredData);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const getAttendanceData = async () => {
    try {
      const data = await getDocs(collectionAttendance);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAttendanceList(filteredData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Create chart on component mount
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const data = {
        labels: ["Students", "Courses", "Attendance"],
        datasets: [
          {
            label: "Total Number",
            data: [students.length, courses.length, attendanceList.length],
            backgroundColor: [
              "rgba(255, 99, 132, 0.7)", // Red for Students
              "rgba(75, 192, 192, 0.7)", // Green for Courses
              "rgba(54, 162, 235, 0.7)", // Blue for Attendance
            ],
          },
        ],
      };
      const config = {
        type: "bar", // Use bar chart to represent the data
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      };

      // Create new chart instance
      chartInstanceRef.current = new Chart(ctx, config);
    }

    // Cleanup function to destroy chart on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [students, courses, attendanceList]); // Update the chart when these dependencies change

  // Fetch data on component mount and update
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getStudent();
        await getCourses();
        await getAttendanceData();
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-4">Students List</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Total Number of Students</th>
                  <th scope="col">Total Number of Courses</th>
                  <th scope="col">Number of Attendance Record</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <h4>{students.length}</h4>
                  </td>
                  <td>
                    <h4>{courses.length}</h4>
                  </td>
                  <td>
                    <h4>{attendanceList.length}</h4>
                  </td>
                </tr>
                {loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "1.5rem" }}>
                        DATA FETCHING ...
                      </span>
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-10 mx-auto">
          <canvas ref={chartRef} ></canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
