import React, { Component } from "react";
import NavbarField from "./NavbarField";
import ProjectDetails from "./projectDetails";

class Details extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    return (
      <>
        <>
          <NavbarField showSearch={false} />
          <ProjectDetails disableAddNew={true} {...this.props} />
        </>
      </>
    );
  }
}

export default Details;
