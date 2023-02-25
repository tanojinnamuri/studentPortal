import React, { Component } from "react";

import url from "../utils/url_config";
import { Link, useHistory } from "react-router-dom";
import Dashboard from "./dashboard";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import NavbarField from "./NavbarField";
import ProjectModal from "./ProjectModal";
import ProjectDetails from "./projectDetails";

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    this.props.whenLoggedOut();
    this.props.history.push(url.login);
  };
  render() {
    return (
      <>
        <Router>
          <NavbarField showLogout={true} hanlelog={this.handleLogout} />

          <Switch>
            <Route path={url.dashboard}>
              <Dashboard userId={this.props.id} {...this.props} />
            </Route>
            <Route path={url.addProject}>
              <ProjectModal userId={this.props.id} {...this.props} />
            </Route>
            <Route path={url.projectDetail}>
              <ProjectDetails userId={this.props.id} {...this.props} />
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}

export default SideBar;
