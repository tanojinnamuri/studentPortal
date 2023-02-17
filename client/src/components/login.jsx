import React, { Component } from "react";
import { Link } from "react-router-dom";
import url from "../utils/url_config";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

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
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="login-logo">
            <a href="../../index2.html">
              <b>Project</b> Management
            </a>
          </div>
          {/* /.login-logo */}
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <form onSubmit={(e) => this.handleSubmit(e)}>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
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
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign In
                    </button>
                  </div>
                  {/* /.col */}
                </div>
              </form>
              <p className="mb-0">
                <Link to={url.register} className="text-center">
                  Register a new membership
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
    );
  }
}

export default Login;
