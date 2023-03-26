import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Register from "./components/register.jsx";
import Dashborad from "./components/dashboard.jsx";
import Login from "./components/login.jsx";

import auth_axios from "./utils/auth_axios.js";
import url from "./utils/url_config.js";
import SideBar from "./components/sideBar.jsx";
import Home from "./components/Home.jsx";
import ProjectModal from "./components/ProjectModal.jsx";
import ProjectDetails from "./components/projectDetails.jsx";
import Details from "./components/details.jsx";
import VideoPlayer from "./components/videoplayer.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    // preserve state on login
    this.state = {
      loggedIn: localStorage.getItem("token") ? true : false,
      userLogIn: localStorage.getItem("userToken") ? true : false,
    };
    if (this.state.loggedIn) {
      auth_axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("token");
    }

    if (this.state.userLogIn) {
      auth_axios.defaults.headers.common["Authorization"] =
        "Bearer " + localStorage.getItem("userToken");
    }
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleLoggedOut = this.handleLoggedOut.bind(this);
    this.handleUserLoggedIn = this.handleUserLoggedIn.bind(this);
    this.handleUserLoggedOut = this.handleUserLoggedOut.bind(this);
  }

  handleUserLoggedIn() {
    this.setState({ userLogIn: true });
    auth_axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("userToken");
  }

  handleLoggedIn() {
    this.setState({ loggedIn: true });

    // set the token
    auth_axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("token");
  }

  handleLoggedOut() {
    this.setState({ loggedIn: false });

    // remove the token
    auth_axios.defaults.headers.common["Authorization"] = null;
  }

  handleUserLoggedOut() {
    this.setState({ userLogIn: false });

    // remove the token
    auth_axios.defaults.headers.common["Authorization"] = null;
  }

  // get the token
  componentDidMount() {
    this.setState({
      loggedIn: localStorage.getItem("token") ? true : false,
      userLogIn: localStorage.getItem("userToken") ? true : false,
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path={url.dashboard}
            render={(props) => {
              return this.state.loggedIn ? (
                <SideBar
                  {...props}
                  whenLoggedOut={this.handleLoggedOut}
                  id={localStorage.getItem("_id")}
                  isloggedIn={this.state.loggedIn}
                />
              ) : (
                <Redirect to={url.login} />
              );
            }}
          />
          <Route
            exact
            path={url.login}
            render={(props) => {
              return this.state.loggedIn ? (
                <Redirect
                  to={url.dashboard}
                /> /*if user is login then redirect user to dashboard*/
              ) : (
                <Login {...props} whenLoggedIn={this.handleLoggedIn} />
              );
            }}
          />

          <Route
            exact
            path={url.register}
            render={(props) => {
              return this.state.loggedIn ? (
                <Redirect
                  to={url.dashboard}
                /> /*if user is login then redirect user to dashboard*/
              ) : (
                <Register {...props} whenLoggedIn={this.handleLoggedIn} />
              );
            }}
          />

          <Route
            exact
            path={"/"}
            render={(props) => {
              return this.state.loggedIn ? (
                <Redirect to={url.dashboard} />
              ) : (
                <Home {...props} />
                // <ProjectDetails />
              );
            }}
          />

<Route
            exact
            path={url.sample}
            render={(props) => {
              return this.state.loggedIn ? (
                <Redirect to={url.dashboard} />
              ) : (
                <VideoPlayer {...props} />
                // <ProjectDetails />
              );
            }}
          />

          <Route
            exact
            path={url.addProject}
            render={(props) => {
              return this.state.loggedIn ? (
                <SideBar
                  {...props}
                  whenLoggedOut={this.handleLoggedOut}
                  id={localStorage.getItem("_id")}
                  isloggedIn={this.state.loggedIn}
                />
              ) : (
                <Redirect
                  to={url.login}
                /> /*if user is login then redirect user to dashboard*/
              );
            }}
          />

          <Route
            exact
            path={url.projectDetail}
            render={(props) => {
              return this.state.loggedIn ? (
                <SideBar
                  {...props}
                  whenLoggedOut={this.handleLoggedOut}
                  id={localStorage.getItem("_id")}
                  isloggedIn={this.state.loggedIn}
                />
              ) : (
                <Details {...props} />
              );
            }}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
