import React, { Component } from "react";
import { Link } from "react-router-dom";
import url from "../utils/url_config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarField from "./NavbarField";
import "./style.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      role: "Student",
      confirmpassword: "",
      department: "",
      errorMessages: [],
      successMessages: [],
      departmentList : []
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    if (
      this.state.firstname.length == 0 ||
      this.state.lastname.length == 0 ||
      this.state.username.length == 0 ||
      this.state.email.length == 0 ||
      this.state.password.length == 0 ||
      this.state.department.length == 0 ||
      this.state.confirmpassword.length == 0
    ) {
      toast.error("Please fill all fields before sign up");
    } else if (this.state.password != this.state.confirmpassword) {
      toast.error("password and confirm password are not matched");
    } else {
      axios
        .post(`http://localhost:3000/api/users/register`, {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          username: this.state.username,
          email: this.state.email,
          pswd: this.state.password,
          role: this.state.role,
          department: this.state.department,
        })
        .then((res) => {
          this.setState({ errorMessages: [] });
          toast.success("User Successfully Created. Redirecting...");
          this.setState({
            successMessages: ["User Successfully Created. Redirecting..."],
          });
          setTimeout(() => {
            // go to login page
            this.props.history.push(url.login);
          }, 2000);
        })
        .catch((err) => {
          if (err.response && Array.isArray(err.response.data.messages)) {
            const msgs = err.response.data.messages.map((v) => {
              toast.error(v.msg);
            });
            this.setState({ errorMessages: msgs });
          }
          throw err;
        });
    }
  }

  async componentDidMount() {
    await this.getdepartmentList();
  }

  async getdepartmentList() {
    await axios
      .get("http://localhost:3000/api/departments/getAll")
      .then((res) => {
        let data = [];

        this.setState({ departmentList: res.data });
      })
      .catch((err) => {
        throw err;
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  render() {
    const { departmentList, department } = this.state;
    return (
      <div>
        <NavbarField showLogout={false} />
        <div className="hold-transition register-page">
          <h1>Project Management</h1>
          <div className="register-box">
            <div className="register-logo">
              <a href="#"></a>
            </div>
            <div className="card">
              <div className="card-body register-card-body">
                <h5 className="login-box-msg">Register a new user</h5>
                <form action="" method="post">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="firstname"
                      placeholder="First Name"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-user" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="lastname"
                      placeholder="Last Name"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-user" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="User Name"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-user" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-envelope" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="confirmpassword"
                      placeholder="Re-Enter password"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                  </div>

                  <div className="input-group mb-3">
                    <select
                      name="role"
                      className="form-control"
                      onChange={(e) => this.handleChange(e)}
                    >
                      <option value="" disabled selected>
                        Select your role
                      </option>
                      <option value={"Student"}>Student</option>
                      <option value={"Viewer"}>Viewer</option>
                      <option value={"Rewiewer"}>Rewiewer</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                  <select
            name="department"
            className="form-control"
            value={department}
            onChange={this.handleChange}
          >
            <option value="">Select your department ......</option>
            {departmentList.map((item) => (
                <option key={item.DepartmentId} value={item.value}>
                {item.DepartmentName}
              </option>
            ))}
          </select>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        onClick={(e) => {
                          this.handleSubmit(e);
                        }}
                      >
                        Register
                      </button>
                    </div>
                    {/* /.col */}
                  </div>
                </form>
                <br></br>
                <Link to={url.login} className="text-center">
                  Already have an Account? Login
                </Link>
              </div>
              {/* /.form-box */}
            </div>
            {/* /.card */}
          </div>
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    );
  }
}

export default Register;
