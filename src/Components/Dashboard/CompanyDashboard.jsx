import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";
import Message from "../Message/Message";

function CompanyDashboard() {
  const [employees, setEmployees] = useState(null);
  const [loading, setLoading] = useState(false)
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
        setLoading(true)
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
        setLoading(false)
        setEmployees(result.employees);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (accessToken) {
      fetchEmployees(accessToken);
    }
  }, [accessToken]);

  const approveEmployee = async (id) => {
    try {
      setLoading(true)
      const verifyUser = await fetch(
        `${process.env.REACT_APP_BASE_URL}/company/update-employee-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            employeeId: id,
            status: true
          }),
        }
      );

      const result = await verifyUser.json();
      setLoading(false)
      if(!result.success) return setError(result.msg);

      setSucces("SuccessFully Approved!");
      setError("");
      window.location.href = "/company-dashboard"
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
        <div className="total-employees">
          <h1>Company Panel</h1>
          <div className="employees-in-number">
            <div className="total-in-number">
              <div className="employees-icon">
                <i class="fa-solid fa-users"></i>
              </div>
              <div className="employees-text">
                <p>Total Employees</p>
                <p>{employees ? employees.length : 0}</p>
              </div>
            </div>
          </div>

          <div className="employee-request">
            <div className="search">
              <input
                type="search"
                className="form-control"
                placeholder="Search any employee..."
              />
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
                  <th scope="col">Date of Birth</th>
                  <th scope="col">Request</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {employees &&
                  employees.map(
                    (em) =>
                      !em.approvedByCompany && (
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
                                src={em.personalInformation.profilePic}
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
                          <td>
                            <button
                              type="button"
                              className="continue"
                              onClick={() => approveEmployee(em._id)}
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>
        </div>

        { error.length > 1 && <Message message={error} type="danger"/> } 
        { success.length > 1 && <Message message={success} type="success"/> }
        {loading && 
          <div class="d-flex justify-content-center loader">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        }
    </>
  );
}

export default CompanyDashboard;
