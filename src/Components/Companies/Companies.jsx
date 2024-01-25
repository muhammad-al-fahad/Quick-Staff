import "./companies.css";
import { useEffect, useState, createRef } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../Message/Message";
import imageUpload from "../../Utils/imageUpload";

function Companies() {
  const initialState = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    address: "",
    logo: "",
    search: "",
    success: "",
    error: ""
  }

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false)
  const [filterUsers, setFilteredUsers] = useState([])
  const [createCompany, setCreateCompany] = useState(initialState)
  const [role, setRole] = useState("");

  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const inputFile = createRef();

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
        setRole(result.user.role);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (accessToken) {
      fetchAdmin(accessToken);
    }
  }, [accessToken]);



  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const verifyUser = await fetch(
          `${process.env.REACT_APP_BASE_URL}/company/find-all-companies`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await verifyUser.json();
        setCompanies(result.companies);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (role === "admin") {
      fetchCompanies();
    }
  }, [role]);


  const handleSearch = (query) => {
    if(companies) {
      const filtered = companies.filter(company => company.credentialDetails.email === query);
      setFilteredUsers(filtered)
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCreateCompany({...createCompany, [name]: value})
  }

  const handleSubmit = async (props) => {
    props.preventDefault();
    
    try {
      setLoading(true)
      let media = await imageUpload([createCompany.logo])

      if(createCompany.password.length < 1 || createCompany.email.length < 1 || createCompany.name.length < 1 || !createCompany.logo) {
        setLoading(false)
        return setCreateCompany({...createCompany, error: "Please fill all the fields", success: ""})
      }
      else if(createCompany.password.length < 8) {
        setLoading(false)
        return setCreateCompany({...createCompany, error: "Password should be minimum of 8 characters", success: ""})
      }
      else if(createCompany.password !== createCompany.confirm_password) {
        setLoading(false)
        return setCreateCompany({...createCompany, error: "Password don't match", success: ""})
      }

      const verifyUser = await fetch(`${process.env.REACT_APP_BASE_URL}/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          companyName: createCompany.name,
          companyPhone: createCompany.phone,
          companyAddress: createCompany.address,
          logo: media[0].url,
          companyEmail: createCompany.email,
          companyPassword: createCompany.password
        })
      });

      const result = await verifyUser.json();
      
      if(!result.success) {
        setLoading(false)
        return setCreateCompany({...createCompany, error: result.msg, success: ""})
      }

      setLoading(false)
      setCreateCompany({...createCompany, success: "Create Company SuccessFully!", error: ""})
      window.location.reload();
    } catch(error) {
      console.error(error.message)
    }
  }

  return (
    <>
      <div className="total-employees">
        <div className="employee-request">
          <div className="search">
            <input
              type="search"
              className="form-control"
              placeholder="Search any company..."
              name="search"
              value={createCompany.search}
              onChange={handleChange}
            />
            <i class="fa-solid fa-magnifying-glass" onClick={() => handleSearch(createCompany.search)}></i>
          </div>

          <div className="add-company">
            <button
              type="button"
              className="continue"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <div className="outer-table">
          <table class="table table-striped ">
            <thead className="table-head">
              <tr className="table-row">
                <th scope="col">
                  <input type="checkbox" className="form-check-input" />
                </th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Address</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {companies && filterUsers.length !== 0 ? filterUsers.map((company) => (
                <tr className="table-row-company" key={company._id}>
                    <td>
                      <input type="checkbox" className="form-check-input" />
                    </td>
                    <td>
                      <div className="row-image">
                        <img src={company.logo ? company.logo : 'https://res.cloudinary.com/dqg52thyo/image/upload/v1703755670/Quick%20Staff/company-default_bjqpt8.png'} alt="" width={50} height={50}/>
                      </div>
                      <p>{company.companyName}</p>
                    </td>
                    <td>{company.credentialDetails.email}</td>
                    <td>
                      {company.phoneNumber ? company.phoneNumber : "+923233668477"}
                    </td>
                    <td>{company.address ? company.address : "none"}</td>
                  </tr>
              ))
              : companies.map((company) => (
                <tr className="table-row" key={company._id}>
                  <th scope="row">
                    <input type="checkbox" className="form-check-input" />
                  </th>
                  <td>
                    <div className="row-image">
                      <img src={company.logo ? company.logo : 'https://res.cloudinary.com/dqg52thyo/image/upload/v1703755670/Quick%20Staff/company-default_bjqpt8.png'} alt="" width={50} height={50}/>
                    </div>
                    <p>{company.companyName}</p>
                  </td>
                  <td>{company.credentialDetails.email}</td>
                  <td>
                    {company.companyPhone}
                  </td>
                  <td title={company.companyAddress}>{company.companyAddress.length < 12 ? company.companyAddress : company.companyAddress.substring(0, 18) + '....'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>  
        </div>

        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Company
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Name"
                      name="name"
                      value={createCompany.name}
                      onChange={handleChange}
                    />
                  </div>

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
                      value={createCompany.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Password"
                      name="password"
                      value={createCompany.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Confirm Password"
                      name="confirm_password"
                      value={createCompany.confirm_password}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Phone
                    </label>
                    <input
                      type="tel"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="+09 000 000 0000"
                      name="phone"
                      value={createCompany.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Address"
                      name="address"
                      value={createCompany.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">
                      Logo
                    </label>
                    <input
                      ref={inputFile}
                      type="file"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Confirm Password"
                      name="logo"
                      accept="image/*"
                      onChange={(e) => setCreateCompany({...createCompany, logo: e.target.files[0]})}
                    />
                    {
                      createCompany.logo && createCompany.logo instanceof File && <img src={URL.createObjectURL(createCompany.logo)} alt="" width={150} height={150} style={{marginTop: '2rem', marginInline: '10rem', borderRadius: '100px'}}/>
                    }
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="continue" onClick={handleSubmit}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        {createCompany.error.length > 1 && <Message message={createCompany.error} type="danger" setUser={setCreateCompany} user={createCompany}/>}
        {createCompany.success.length > 1 && <Message message={createCompany.success} type="success" setUser={setCreateCompany} user={createCompany}/>}
        {loading && 
          <div class="d-flex justify-content-center loader">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      </div>
    </>
  );
}

export default Companies;
