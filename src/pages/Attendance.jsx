import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { Space, Alert, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../config/firebase";
const { confirm } = Modal;

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [loading, setLoading] = useState(true);

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

  console.log("Students:", students);
  console.log("Courses:", courses);
  console.log("Attendance List:", attendanceList);

  const handleConfirmAttendance = async () => {
    // Validate that all required fields are selected
    if (
      !selectedStudent ||
      !selectedCourse ||
      !attendanceDate ||
      !attendanceStatus
    ) {
      // Show an error message or handle the case where not all fields are selected
      return;
    }

    try {
      // Find the selected student and course
      const selectedStudentObj = students.find(
        (student) => student.id === selectedStudent
      );
      const selectedCourseObj = courses.find(
        (course) => course.id === selectedCourse
      );

      // Add a new document to the "attendance" collection
      await addDoc(collectionAttendance, {
        stname: selectedStudentObj.name,
        crname: selectedCourseObj.title,
        date: attendanceDate,
        attendance: attendanceStatus,
      });

      // Reset the state after confirming attendance
      setSelectedStudent("");
      setSelectedCourse("");
      setAttendanceDate("");
      setAttendanceStatus("");

      // Refresh attendance data
      await getAttendanceData();
      toast.success("Attendance added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding attendance data:", error);
    }
  };

  const deleteCourse = async (id, studentName) => {
    const result = await confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${studentName}'s attendance?`, // Corrected the prompt
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await deleteDoc(doc(db, "attendance", id));
        getAttendanceData();
        toast.success("Attendance deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      },
      onCancel: () => {},
    });
  };
  return (
    <>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-4 text-light">Attendance List</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Student Name</th>
                  <th scope="col">Course Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Attendance</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((attendance) => (
                  <tr key={attendance.id}>
                    <td>{attendance.stname}</td>
                    <td>{attendance.crname}</td>
                    <td>{attendance.date}</td>
                    <td>{attendance.attendance}</td>
                    <td>
                      <MdDelete
                        onClick={() =>
                          deleteCourse(attendance.id, attendance.stname)
                        }
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "22px",
                          marginLeft : "20px"
                        }}
                      />
                    </td>
                  </tr>
                ))}
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

        <div className="container-fluid">
          <div className="row">
            <div className="col-2 ms-auto">
              <button
                type="button"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Record Attendance
              </button>
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1
                        className="modal-title fs-5 text-dark"
                        id="exampleModalLabel"
                      >
                        Record Attendance
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="form-outline mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="form2Example1"
                          >
                            All Student Name
                          </label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => {
                              console.log("Selected Student:", e.target.value);
                              setSelectedStudent(e.target.value);
                            }}
                            value={selectedStudent}
                          >
                            <option value="" disabled>
                              Select Student
                            </option>
                            {students.map((student) => (
                              <option key={student.id} value={student.id}>
                                {student.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-outline mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="form2Example2"
                          >
                            Name
                          </label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => {
                              console.log("Selected Course:", e.target.value);
                              setSelectedCourse(e.target.value);
                            }}
                            value={selectedCourse}
                          >
                            <option value="" disabled>
                              Select Course
                            </option>
                            {courses.map((course) => (
                              <option
                                key={course.id}
                                value={course.id}
                                className="text-dark"
                              >
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-outline mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="form2Example4"
                          >
                            Date
                          </label>
                          <br />
                          <input
                            type="date"
                            className="form-control"
                            id="attendanceDate"
                            name="attendanceDate"
                            style={{ cursor: "pointer" }}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                            value={attendanceDate}
                          />
                        </div>
                        <div className="form-outline mb-3">
                          <label
                            className="form-label text-dark"
                            htmlFor="form2Example4"
                          >
                            Attendance
                          </label>
                          <br />
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="attendance"
                              id="absent"
                              onChange={() => setAttendanceStatus("Absent")}
                              checked={attendanceStatus === "Absent"}
                            />
                            <label
                              className="form-check-label text-dark"
                              htmlFor="absent"
                            >
                              Absent
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="attendance"
                              id="present"
                              onChange={() => setAttendanceStatus("Present")}
                              checked={attendanceStatus === "Present"}
                            />
                            <label
                              className="form-check-label text-dark"
                              htmlFor="present"
                            >
                              Present
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-dismiss="modal"
                        onClick={handleConfirmAttendance}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default Attendance;
