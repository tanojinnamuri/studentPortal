import React, { Component } from "react";
import { Link } from "react-router-dom";
import url from "../utils/url_config";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarField from "./NavbarField";
import "./style.css";
import Button from "react-bootstrap/Button";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // log in
    axios
      .post("http://localhost:3000/api/users/login", {
        email: this.state.email,
        pswd: this.state.password,
      })
      .then((res) => {
        toast.success("Logged In. Redirecting...");

        // store token in the browser
        localStorage.setItem("token", res.data.token);
        // store user id
        localStorage.setItem("_id", res.data._id);

        localStorage.setItem("email", res.data.email);

        localStorage.setItem("isReviewer", res.data.reviewer);
        setTimeout(() => {
          // tell parent that user loggedIn
          this.props.whenLoggedIn();
          // login to dashboard
          this.props.history.push(url.dashboard);
        }, 2000);
      })
      .catch((err) => {
        if (err.response && Array.isArray(err.response.data.messages)) {
          const msgs = err.response.data.messages.map((v) =>
            toast.error(v.msg)
          );
        }
        throw err;
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  render() {
    return (
      <div>
        <NavbarField showLogout={false} />

        <div className="hold-transition login-page align-top">
          <h1>Project Management</h1>

          <div className="login-box">
            <div className="login-logo">
              <a href="../../index2.html">
                {/* <h1>Project Management</h1> */}
              </a>
            </div>
            {/* /.login-logo */}
            <div className="card">
              <div className="card-body login-card-body">
                <h5 className="login-box-msg">Welcome!</h5>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email Address"
                      required
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
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      required
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* /.col */}
                    <div className="col-12">
                      <Button type="submit" className="custbtn">
                        Log In
                      </Button>
                    </div>
                    {/* /.col */}
                  </div>
                </form>
                <p className="mb-0">
                  <Link to={url.register} className="text-center">
                    Not a Member? Register
                  </Link>
                </p>
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
              {/* /.login-card-body */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
