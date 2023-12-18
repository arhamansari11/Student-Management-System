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

const Students = () => {
  // Read Data
  const [students, setStudents] = useState([]);
  const collectionRef = collection(db, "students");
  const [loading, setLoading] = useState(true);

  const getStudent = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const data = await getDocs(collectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStudents(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, you might want to show an error message to the user
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getStudent();
    };
    fetchData();
  }, []);

  // Create Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");

  const submitData = async () => {
    await addDoc(collectionRef, {
      name: name,
      email: email,
      gender: gender,
      contact: contact,
    });
    getStudent();
    toast.success("Student added successfully!", {
      position: "top-right",
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setName("");
    setEmail("");
    setGender("");
    setContact("");
  };

  // Del Data
  const deleteStudent = async (id, studentName) => {
    const result = await confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${studentName}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await deleteDoc(doc(db, "students", id));
        getStudent();
        toast.success("Student deleted successfully!", {
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
  const [newname, setNewname] = useState("");
  const [newemail, setNewemail] = useState("");
  const [newgender, setNewgender] = useState("");
  const [newcontact, setNewcontact] = useState("");

  const updatedValues = (id, name, email, gender, contact) => {
    setUpdateId(id);
    setNewname(name);
    setNewemail(email);
    setNewgender(gender);
    setNewcontact(contact);
  };

  const setUpdateValues = async () => {
    const newdoc = doc(db, "students", updateId);
    await updateDoc(newdoc, {
      name: newname,
      email: newemail,
      gender: newgender,
      contact: newcontact,
    });
    setUpdateId(null);
    getStudent();
    toast.success("Student Updated successfully!", {
      position: "top-right",
      autoClose: 3000, // 3 seconds
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
            <h1 className="text-center mb-4">Students List</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Number</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.name}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.gender}</td>
                    <td>{student.contact}</td>
                    <td>
                      <MdDelete
                        onClick={() => deleteStudent(student.id, student.name)}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "22px",
                        }}
                      />
                      <MdEdit
                        data-bs-toggle="modal"
                        data-bs-target="#updateStudentModal"
                        onClick={() =>
                          updatedValues(
                            student.id,
                            student.name,
                            student.email,
                            student.gender,
                            student.contact
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
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "1.5rem" }}>
                        DATA FETCHING ...
                      </span>
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Update Student Modal */}
      <div
        className="modal fade"
        id="updateStudentModal"
        tabIndex="-1"
        aria-labelledby="updateStudentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-dark"
                id="updateStudentModalLabel"
              >
                Update Student
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
                    Updated Email address
                  </label>
                  <input
                    type="email"
                    id="updateFormExample1"
                    className="form-control"
                    placeholder="Enter Updated Email"
                    onChange={(e) => setNewemail(e.target.value)}
                    value={newemail}
                  />
                </div>
                <div className="form-outline mb-3">
                  <label
                    className="form-label text-dark"
                    htmlFor="updateFormExample2"
                  >
                    Updated Name
                  </label>
                  <input
                    type="text"
                    id="updateFormExample2"
                    className="form-control"
                    placeholder="Enter Updated Name"
                    onChange={(e) => setNewname(e.target.value)}
                    value={newname}
                  />
                </div>
                <div className="form-outline mb-3">
                  <label
                    className="form-label text-dark"
                    htmlFor="updateFormExample3"
                  >
                    Updated Gender
                  </label>
                  <input
                    type="text"
                    id="updateFormExample3"
                    className="form-control"
                    placeholder="Enter Updated Gender"
                    onChange={(e) => setNewgender(e.target.value)}
                    value={newgender}
                  />
                </div>
                <div className="form-outline mb-3">
                  <label
                    className="form-label text-dark"
                    htmlFor="updateFormExample4"
                  >
                    Updated Number
                  </label>
                  <input
                    type="number"
                    id="updateFormExample4"
                    className="form-control"
                    placeholder="Enter Updated Number"
                    onChange={(e) => setNewcontact(e.target.value)}
                    value={newcontact}
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
                Update Student
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
              Add New Student
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
                      Add Student
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
                          Email address
                        </label>
                        <input
                          type="email"
                          id="form2Example1"
                          className="form-control"
                          placeholder="Enter Your Email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-outline mb-3">
                        <label
                          className="form-label text-dark"
                          htmlFor="form2Example2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="form2Example2"
                          className="form-control"
                          placeholder="Enter Your Name"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="form-outline mb-3">
                        <label
                          className="form-label text-dark"
                          htmlFor="form2Example3"
                        >
                          Gender
                        </label>
                        <input
                          type="text"
                          id="form2Example3"
                          className="form-control"
                          placeholder="Enter Your Gender"
                          onChange={(e) => setGender(e.target.value)}
                        />
                      </div>
                      <div className="form-outline mb-3">
                        <label
                          className="form-label text-dark"
                          htmlFor="form2Example4"
                        >
                          Number
                        </label>
                        <input
                          type="number"
                          id="form2Example4"
                          className="form-control"
                          placeholder="Enter Your Number"
                          onChange={(e) => setContact(e.target.value)}
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

export default Students;
