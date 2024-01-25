import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import Register from "./Components/Register/Register";
import Employee from "./Components/Employee/Employee";
import Companies from "./Components/Companies/Companies";
import Sidebar from "./Components/Sidebar/Sidebar";
import CompanyDashboard from './Components/Dashboard/CompanyDashboard';
import CompanyLogin from './Components/Login/CompanyLogin';
import Product from "./Components/Product/Product";

function App() {
  return (
    <>
    <Router>
      <div className="main-body">
        <Sidebar />
        <div className="web-pages">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/company-login" element={<CompanyLogin />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/product" element={<Product />} />
          </Routes>
        </div>
      </div>
    </Router>
  </>
  );
}

export default App;
