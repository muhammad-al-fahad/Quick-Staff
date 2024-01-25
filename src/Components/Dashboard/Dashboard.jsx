import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";
import Message from "../Message/Message";

function Dashboard() {
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(false)
  const [success, setSucces] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const currentDate = new Date();
  const lastWeekDate = new Date(currentDate);
  lastWeekDate.setDate(currentDate.getDate() - 10);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    else return setAccessToken(token);
  }, []);

  useEffect(() => {
    const fetchAdmin = async (token) => {
      try {
        setLoading(true)
        const verifyUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/user/own-profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          }
        );

        const result = await verifyUser.json();
        setRole(result.user.role)
      } catch (error) {
        console.error(error.message);
      }
    };

    if (accessToken) {
      fetchAdmin(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchCompanies = async (token) => {
      try {
        const verifyUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/company/find-all-companies`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          }
        );

        const totalUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/user/all-users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          }
        );

        const result = await verifyUser.json();
        const result2 = await totalUser.json();
        setLoading(false);
        setCompanies(result.companies);
        setTotalUser(result2.length);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (role === "admin") {
      fetchCompanies(accessToken);
    }
  }, [role]);

  return (
    <>
      {role === "admin" && (
        <div className="total-employees">
          <h1>Admin Panel</h1>
          <div className="employees-in-number">
            <div className="total-in-number">
              <div className="employees-icon">
                <i class="fa-solid fa-building"></i>
              </div>
              <div className="employees-text">
                <p>Total Companies</p>
                <p>{companies ? companies.length : 0}</p>
              </div>
            </div>

            <div className="total-in-number">
              <div className="employees-icon">
                <i class="fa-solid fa-user"></i>
              </div>
              <div className="employees-text">
                <p>Total Users</p>
                <p>{totalUser}</p>
              </div>
            </div>
          </div>

          {/* <div className="employee-request">
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
                  <th scope="col">Address</th>
                  <th scope="col">Request</th>
                </tr>
              </thead>
              <tbody className="table-body">
              {companies && companies.filter((cm) => {
                const companyDate = new Date(cm.createdAt);
                return companyDate >= lastWeekDate && companyDate <= currentDate
              }).map(company => 
                <tr className="table-row" key={company._id}>
                  <th scope="row">
                    <input type="checkbox" className="form-check-input" />
                  </th>
                  <td>
                    <div className="row-image">
                      <img
                        src={company.logo}
                        alt=""
                      />
                    </div>
                    <p>{company.companyName}</p>
                  </td>
                  <td>{company.credentialDetails.email}</td>
                  <td>{company.phoneNumber ? company.phoneNumber : "none"}</td>
                  <td>{company.address ? company.address : "none"}</td>
                  <td className="new">new</td>
                </tr>
                )}
              </tbody>
            </table>
              </div> */}
        </div>
      )}

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

export default Dashboard;
