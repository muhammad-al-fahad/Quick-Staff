import { useEffect, useState } from "react";
import "./sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (pathname === "/login" || pathname === "/register") {
      setAccessToken("");
    } else {
      setAccessToken(token);
    }
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    else return setAccessToken(token);
  }, []);

  useEffect(() => {
    const fetchAdmin = async (token) => {
      try {
        const verifyUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/user/own-profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await verifyUser.json();
        setUser(result.user)
        setRole(result.user.role);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (accessToken) {
      fetchAdmin(accessToken);
    }
  }, [accessToken]);

  return (
    <>
      {accessToken && (
        <div className="sidebar">
          <Link to={role === "admin" ? "/" : "/company-dashboard"} className="sidebar-logo text-decoration-none">
            <img src="/assets/images/quick-staff-icon.svg" alt="" />
            <p>Quick Staff</p>
          </Link>
          <Link to={role === "admin" ? "/" : "/company-dashboard"} className="sidebar-item text-decoration-none">
            <div className="item-page">
              <i class="fa-solid fa-house"></i>
              <p>Dashboard</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
          </Link>

          <div className="sidebar-main">
            { user && role === "admin" ? (
              <Link
                to="/companies"
                className="sidebar-item text-decoration-none"
              >
                <div className="item-page">
                  <i class="fa-solid fa-building-columns"></i>
                  <p>Companies</p>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
              </Link>
            ) : (
              <>
                <Link
                  to="/employee"
                  className="sidebar-item text-decoration-none"
                >
                  <div className="item-page">
                    <i class="fa-solid fa-users"></i>
                    <p>Employees</p>
                  </div>
                  <i class="fa-solid fa-chevron-right"></i>
                </Link>
                <Link
                  to="/product"
                  className="sidebar-item text-decoration-none"
                >
                  <div className="item-page">
                  <i class="fa-solid fa-cubes fa-lg"></i>
                    <p>Products</p>
                  </div>
                  <i class="fa-solid fa-chevron-right"></i>
                </Link>
              </>
            )}
          </div>

          { user && role === "admin" && 
            <Link to={role === "admin" ? "/login" : "/company-login"} className="sidebar-user text-decoration-none">
              <img src={user.personalInformation.profilePic ? user.personalInformation.profilePic : "https://res.cloudinary.com/dqg52thyo/image/upload/v1703871419/images-removebg-preview_pq1avr.png"} alt="" width={50} height={50}/>
              <p>{user.personalInformation.firstName.slice(0,1).toUpperCase() + user.personalInformation.firstName.slice(1,user.personalInformation.firstName.length) 
                + " " + user.personalInformation.lastName.slice(0,1).toUpperCase() + user.personalInformation.lastName.slice(1,user.personalInformation.lastName.length)}</p>
            </Link>
          }

          <Link
            to={role === "admin" ? "/login" : "/company-login"}
            className="sidebar-item text-decoration-none"
            onClick={() => localStorage.removeItem("token")}
          >
            <div className="item-page">
              <i class="fa-solid fa-right-from-bracket"></i>
              <p>Logout</p>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
          </Link>
        </div>
      )}
    </>
  );
}

export default Sidebar;
