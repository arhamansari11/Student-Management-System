import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { MdDelete, MdEdit } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Space, Alert, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;

const Courses = () => {
  // Read Data
  const [courses, setCourses] = useState([]);
  const collectionRef = collection(db, "courses");
  const [loading, setLoading] = useState(true);

  const getCourses = async () => {
    try {
      setLoading(true);
      const data = await getDocs(collectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCourses(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCourses();
    };
    fetchData();
  }, []);

  // Create Data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const submitData = async () => {
    await addDoc(collectionRef, {
      title: title,
      description: description,
      code: code,
    });
    getCourses();
    toast.success("Course added successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTitle("");
    setDescription("");
    setCode("");
  };

  // Del Data
  const deleteCourse = async (id, courseTitle) => {
    const result = await confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${courseTitle}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await deleteDoc(doc(db, "courses", id));
        getCourses();
        toast.success("Course deleted successfully!", {
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

  // Update Data
  const [updateId, setUpdateId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCode, setNewCode] = useState("");

  const updatedValues = (id, title, description, code) => {
    setUpdateId(id);
    setNewTitle(title);
    setNewDescription(description);
    setNewCode(code);
  };

  const setUpdateValues = async () => {
    const newdoc = doc(db, "courses", updateId);
    await updateDoc(newdoc, {
      title: newTitle,
      description: newDescription,
      code: newCode,
    });
    setUpdateId(null);
    getCourses();
    toast.success("Course updated successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-4">Courses List</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Code</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.title}>
                    <td>{course.title}</td>
                    <td>{course.description}</td>
                    <td>{course.code}</td>
                    <td>
                      <MdDelete
                        onClick={() => deleteCourse(course.id, course.title)}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "22px",
                        }}
                      />
                      <MdEdit
                        data-bs-toggle="modal"
                        data-bs-target="#updateCourseModal"
                        onClick={() =>
                          updatedValues(
                            course.id,
                            course.title,
                            course.description,
                            course.code
                          )
                        }
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          fontSize: "22px",
                          marginLeft: "20px",
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
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
      {/* Update Course Modal */}
      <div
        className="modal fade"
        id="updateCourseModal"
        tabIndex="-1"
        aria-labelledby="updateCourseModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark" id="updateCourseModalLabel">
                Update Course
              </h5>
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
                    htmlFor="updateFormExample1"
                  >
                    Updated Title
                  </label>
                  <input
                    type="text"
                    id="updateFormExample1"
                    className="form-control"
                    placeholder="Enter Updated Title"
                    onChange={(e) => setNewTitle(e.target.value)}
                    value={newTitle}
                  />
                </div>
                <div className="form-outline mb-3">
                  <label
                    className="form-label text-dark"
                    htmlFor="updateFormExample2"
                  >
                    Updated Description
                  </label>
                  <input
                    type="text"
                    id="updateFormExample2"
                    className="form-control"
                    placeholder="Enter Updated Description"
                    onChange={(e) => setNewDescription(e.target.value)}
                    value={newDescription}
                  />
                </div>
                <div className="form-outline mb-3">
                  <label
                    className="form-label text-dark"
                    htmlFor="updateFormExample3"
                  >
                    Updated Code
                  </label>
                  <input
                    type="text"
                    id="updateFormExample3"
                    className="form-control"
                    placeholder="Enter Updated Code"
                    onChange={(e) => setNewCode(e.target.value)}
                    value={newCode}
                  />
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
                onClick={setUpdateValues}
              >
                Update Course
              </button>
            </div>
          </div>
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
              Add New Course
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
                      Add Course
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
                          Title
                        </label>
                        <input
                          type="text"
                          id="form2Example1"
                          className="form-control"
                          placeholder="Enter Course Title"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="form-outline mb-3">
                        <label
                          className="form-label text-dark"
                          htmlFor="form2Example2"
                        >
                          Description
                        </label>
                        <input
                          type="text"
                          id="form2Example2"
                          className="form-control"
                          placeholder="Enter Course Description"
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className="form-outline mb-3">
                        <label
                          className="form-label text-dark"
                          htmlFor="form2Example3"
                        >
                          Code
                        </label>
                        <input
                          type="text"
                          id="form2Example3"
                          className="form-control"
                          placeholder="Enter Course Code"
                          onChange={(e) => setCode(e.target.value)}
                        />
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
                      onClick={submitData}
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
  );
};

export default Courses;
