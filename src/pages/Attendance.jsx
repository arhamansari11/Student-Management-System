import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Attendance = () => {
  // Students Data
  const [students, setStudents] = useState([]);
  const collectionR = collection(db, "students");

  const getStudent = async () => {
    try {
      const data = await getDocs(collectionR);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudents(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await getStudent();
    };
    fetchData();
  }, []);

  // Courses Data

  const [courses, setCourses] = useState([]);
  const collectionRe = collection(db, "courses");

  const getCourses = async () => {
    try {
      const data = await getDocs(collectionRe);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCourses(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCourses();
    };
    fetchData();
  }, []);

  return (
    <>
      {" "}
      <button
        type="button"
        className="btn btn-primary"
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
              <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">
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
                  >
                    <option value="" disabled selected>
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
                  >
                    <option value="" disabled selected>
                      Select Course
                    </option>
                    {courses.map((courses) => (
                      <option
                        key={courses.id}
                        value={courses.id}
                        className="text-dark"
                      >
                        {courses.title}
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
                    style={{cursor : "pointer"}}
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
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
