import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./NavbarField.css";
import univname from ".././UAlbanymark-wordsonly.png";
import unilogo from ".././minerva-mark.png";
import Nav from "react-bootstrap/Nav";

import React, { Component } from "react";
import url from "../utils/url_config";
import { MDBIcon } from "mdb-react-ui-kit";
class NavbarField extends Component {
  constructor(props) {
    super(props);
  }
  state = {};

  render() {
    return (
      <>
        <Navbar bg="" variant="dark" className="mainnavbar">
          <Container>
            <Navbar.Brand>
              <img alt="" src={unilogo} className="d-inline-block align-top" />{" "}
              <img alt="" src={univname} className="d-inline-block align-top" />{" "}
            </Navbar.Brand>
            <Nav>
              {this.props.showLogout ? (
                <>
                  <Nav.Link
                    className="navLink-top"
                    style={{ color: "#eeb211" }}
                    href={url.dashboard}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    className="navLink-top"
                    style={{ color: "#eeb211" }}
                    eventKey={2}
                    onClick={() => this.props.hanlelog()}
                  >
                    Logout
                  </Nav.Link>
                  <Nav.Link
                    className="navLink-top"
                    style={{ color: "#eeb211" }}
                    eventKey={2}
                  >
                    {localStorage.getItem("firstname")}{" "}
                    {localStorage.getItem("lastname")}
                  </Nav.Link>

                </>
              ) : (
                <>
                 <Nav.Link
                    className="navLink-top"
                    style={{ color: "#eeb211" }}
                    href={url.dashboard}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    className="navLink-top"
                    style={{ color: "#eeb211" }}
                    href={url.login}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    className="navLink-top"
                    style={{ color: "#eeb211" }}
                    eventKey={2}
                    href={url.register}
                  >
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default NavbarField;
