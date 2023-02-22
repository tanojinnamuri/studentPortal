import React, { Component } from "react";
import Dashborad from "./dashboard";
import NavbarField from "./NavbarField";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    return (
      <>
        <NavbarField />
        <Dashborad disableAddNew={true} {...this.props} />
      </>
    );
  }
}

export default Home;
