import './employee.css'
import { Link, useNavigate, useLocation } from "react-router-dom";
import Message from "../Message/Message";
import { useEffect, useState } from "react";

function Employee() {
  const [employees, setEmployees] = useState(null);
  const [approved, setApproved] = useState(0);
  const [success, setSucces] = useState("");
  const [error, setError] = useState("");

  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/company-login");
    else return setAccessToken(token);
  }, []);

  useEffect(() => {
    const fetchEmployees = async (token) => {
      try {
        const verifyUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/company/all-employees`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await verifyUser.json();
        setEmployees(result.employees);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (accessToken) {
      fetchEmployees(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if(employees) {
      const checkedEmployees = employees.filter(em => em.approvedByCompany);
      setApproved(checkedEmployees.length)
    }
  }, [employees])

  return (
    <>
      <div className="total-employees">
          <div className="employees-in-number">
            <div className="total-in-number">
              <div className="employees-icon">
              <i class="fa-solid fa-user-check"></i>
              </div>
              <div className="employees-text">
                <p>Approved Requests</p>
                <p>{approved}</p>
              </div>
            </div>
          </div>

          <div className="employee-request">
            <div className="search">
              <input type="search" className="form-control" placeholder="Search any employee..."/>
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>

            <table class="table table-striped">
              <thead className="table-head">
                <tr className="table-row">
                  <th scope="col">
                    <input type="checkbox" className="form-check-input" />
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Gender</th>
                  <th scope="col">DOB</th>
                </tr>
              </thead>
              <tbody className="table-body">
              {employees &&
                employees.map(
                  (em) =>
                      <tr className="table-row" key={em._id}>
                        <th scope="row">
                          <input
                            type="checkbox"
                            className="form-check-input"
                          />
                        </th>
                        <td>
                          <div className="row-image">
                            <img
                              src={em.personalInformation.profilePic ? em.personalInformation.profilePic : 'https://res.cloudinary.com/dqg52thyo/image/upload/v1703871419/images-removebg-preview_pq1avr.png'}
                              alt=""
                            />
                          </div>
                          <p>
                            {em.personalInformation.firstName +
                              " " +
                              em.personalInformation.lastName}
                          </p>
                        </td>
                        <td>{em.credentialDetails.email}</td>
                        <td>{em.personalInformation.phoneNumber}</td>
                        <td>{em.personalInformation.gender.slice(0,1).toUpperCase() + em.personalInformation.gender.slice(1,em.personalInformation.gender.length)}</td>
                        <td>{em.personalInformation.dob ? em.personalInformation.dob : "05/21/12"}</td>
                      </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      { error.length > 1 && <Message message={error} type="danger"/> } 
      { success.length > 1 && <Message message={success} type="success"/> }
    </>
  )
}

export default Employee
