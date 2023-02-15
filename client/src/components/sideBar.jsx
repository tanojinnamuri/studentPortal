import React, { Component } from "react";

import url from "../utils/url_config";
import { Link, useHistory } from "react-router-dom";
import Dashboard from "./dashboard";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");

    this.props.history.push(url.login);
  };
  render() {
    return (
      <>
        <Router>
          <div className="hold-transition sidebar-mini">
            <div className="wrapper">
              {/* Navbar */}
              <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                  <li className="nav-item d-none d-sm-inline-block">
                    <Link to={url.dashboard} className="nav-link">
                      Home
                    </Link>
                  </li>
                </ul>
              </nav>
              {/* /.navbar */}
              {/* Main Sidebar Container */}
              <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Sidebar */}
                <div className="sidebar">
                  {/* Sidebar user (optional) */}
                  <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="info">
                      <a href="#" className="d-block">
                        Welcome
                      </a>
                    </div>
                  </div>

                  <nav className="mt-2">
                    <ul
                      className="nav nav-pills nav-sidebar flex-column"
                      data-widget="treeview"
                      role="menu"
                      data-accordion="false"
                    >
                      {/* Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library */}
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          <i className="nav-icon fas fa-tachometer-alt" />
                          <p>
                            View Projects
                            <i className="right fas fa-angle-left" />
                          </p>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          onClick={() => this.handleLogout()}
                          className="nav-link"
                        >
                          <i className="nav-icon fas fa-tachometer-alt" />
                          <p>
                            Logout
                            <i className="right fas fa-angle-left" />
                          </p>
                        </a>
                      </li>
                    </ul>
                  </nav>
                  {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
                <div className="content-wrapper"></div>
              </aside>
            </div>
          </div>

          <Switch>
            <Route path={url.dashboard}>
              <Dashboard userId={this.props.id} />
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}

export default SideBar;
