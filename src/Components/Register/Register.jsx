import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useState, useEffect } from "react";
import Message from "../Message/Message";

function Register() {
  const initialState = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "  ",
    gender: "",
    profilePic: "",
    email: "",
    password: "",
    confirm_password: "",
    success: "",
    error: ""
  }

  const [user, setUser] = useState(initialState);
  const navigate = useNavigate()

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
      if(
          !user.password
         || !user.email
         || !user.dob
         || !user.firstName
         || !user.lastName
         || !user.gender
         || !user.phoneNumber
         ) return setUser({...user, error: "Please fill all the fields", success: ""})
      else if(user.password.length < 8) return setUser({...user, error: "Password should be minimum of 8 characters", success: ""})
      else if(user.password !== user.confirm_password) return setUser({...user, error: "Password don't match", success: ""})
      
      const verifyUser = await fetch(`${process.env.REACT_APP_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalInformation: {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            dob: user.dob,
            gender: user.gender,
            profilePic: user.profilePic
          },
          credentialDetails: {
            email: user.email,
            password: user.password
          },
          deviceInfo: {
            fcm: ""
          }
        })
      });

      const result = await verifyUser.json();
      
      if(!result.success) return setUser({...user, error: result.msg, success: ""})

      localStorage.setItem("token", result.token)
      setUser({...user, success: "Signup Success!", error: ""})
      navigate('/')
    } catch(error) {
      console.error(error.message)
    }
  }

  return (
    <>
      <div className="register">
        <div className="welcome-back">
          <div className="register-form">
            <h1>Welcome to Quick Staff!</h1>
            <form>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleFormControlInput1"
                  placeholder="First Name"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                />
              </div>

              <div class="mb-3">
                <label for="exampleFormControlInput2" class="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleFormControlInput2"
                  placeholder="Last Name"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </div>

              <div class="mb-3">
                <label for="exampleFormControlInput3" class="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  class="form-control date"
                  id="exampleFormControlInput3"
                  placeholder="7/11/1990"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                />
              </div>

              <div class="mb-3">
                <label for="exampleFormControlInput4" class="form-label">
                  Gender
                </label>
                <div className="d-flex gap-5">
                  <div className="d-flex form-check gap-3">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="exampleFormControlInput4-1"
                      name="gender"
                      checked={user.gender === "male" ? true : false}
                      onChange={() => setUser({...user, gender: "male"})}
                    />
                    <label for="exampleFormControlInput4-1" class="form-label">
                      Male
                    </label>
                  </div>

                  <div className="d-flex form-check gap-3">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="exampleFormControlInput4-2"
                      name="gender"
                      checked={user.gender === "female" ? true : false}
                      onChange={() => setUser({...user, gender: "female"})}
                    />
                    <label for="exampleFormControlInput4-2" class="form-label">
                      Female
                    </label>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="exampleFormControlInput5" class="form-label">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  class="form-control"
                  id="exampleFormControlInput5"
                  placeholder="(+91) 00000 00000"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div class="mb-3">
                <label for="exampleFormControlInput6" class="form-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleFormControlInput6"
                  placeholder="someone@example.com"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
            </div>

            <div class="mb-3">
                <label for="exampleFormControlInput6" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleFormControlInput6"
                  placeholder="Password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                />
            </div>

            <div class="mb-3">
                <label for="exampleFormControlInput6" class="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleFormControlInput6"
                  placeholder="Confirm Password"
                  name="confirm_password"
                  value={user.confirm_password}
                  onChange={handleChange}
                />
            </div>
            </form>
          </div>
          <Link to="/" className="register-button text-decoration-none">
            <button type="button" className="button-auth" onClick={handleSubmit}>
              Register
            </button>
          </Link>
          <div className="register-account">
            <p>
              Have an account? 
              <Link to="/login" className="text-decoration-none">
                <span>Sign In</span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      { user.error.length > 1 && <Message message={user.error} type="danger" setUser={setUser} user={user}/> } 
      { user.success.length > 1 && <Message message={user.success} type="success" setUser={setUser} user={user}/> }
    </>
  );
}

export default Register;
