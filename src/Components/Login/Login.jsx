import { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Message from "../Message/Message";

function Login() {
  const initialState = {
    email: "",
    password: "",
    success: "",
    error: ""
  }

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) return navigate('/')
  }, [])

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({...user, [name]: value})
  }

  const handleSubmit = async (props) => {
    props.preventDefault();
    
    try {
      setLoading(true)
      if(user.password.length < 1 || user.email.length < 1) {
        setLoading(false)
        return setUser({...user, error: "Please fill all the fields", success: ""}) 
      }
      else if(user.password.length < 8) {
        setLoading(false)
        return setUser({...user, error: "Password should be minimum of 8 characters", success: ""})
      } 
      
      const verifyUser = await fetch(`${process.env.REACT_APP_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });

      const result = await verifyUser.json();

      if(!result.success) {
        setLoading(false)
        return setUser({...user, error: result.msg, success: ""})
      }
      else if(result.user.role !== 'admin') {
        setLoading(false)
        return setUser({...user, error: "Unauthorized Admin", success: ""})
      }

      setLoading(false)
      localStorage.setItem("token", result.token)
      setUser({...user, success: "Login Success!", error: ""})
      navigate('/')
    } catch(error) {
      console.error(error.message)
    }
  }

  return (
    <>
      <div className="login">
        <div className="login-icon">
          <img src="/assets/images/inno-ascent.png" alt="" />
          <p>InnoAscent</p>
        </div>

        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <Link to="/login" className="text-decoration-none">
                <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked={pathname === '/login' && true}/>
                <label class="btn btn-outline-success" for="btnradio1">Admin Login</label>
            </Link>

            <Link to="/company-login" className="text-decoration-none">
                <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
                <label class="btn btn-outline-secondary" for="btnradio2">Company Login</label>
            </Link>
        </div>

        <div className="welcome-back">
          <div className="login-form">
            <h1>Welcome Back!</h1>
            <form>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  placeholder="Password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <p className="login-forget">Forget Password?</p>
              </div>
            </form>
          </div>

          <Link to="/" className="login-button text-decoration-none">
            <button type="button" className="button-auth" onClick={handleSubmit}>
              Login
            </button>
          </Link>
          
          <div className="login-account">
            <p>
              Don't have an account? 
              <Link to="/register" className="text-decoration-none">
                <span>Register</span>
              </Link>
            </p>
          </div>
        </div>

        <div className="login-app-icon">
          <img src="/assets/images/quick-staff.png" alt="" />
        </div>
      </div>

      { user.error.length > 1 && <Message message={user.error} type="danger" setUser={setUser} user={user}/> } 
      { user.success.length > 1 && <Message message={user.success} type="success" setUser={setUser} user={user}/> }

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

export default Login;
