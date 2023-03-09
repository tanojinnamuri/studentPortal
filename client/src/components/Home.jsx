import React, { Component } from "react";
import Dashborad from "./dashboard";
import NavbarField from "./NavbarField";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  state = { showSearch: false };

  showSearchBar = () => {
    this.setState({ showSearch: !this.state.showSearch });
  };
  render() {
    return (
      <>
        <NavbarField handleSearch={this.showSearchBar} showSearch={true} />
        <Dashborad
          disableAddNew={true}
          {...this.props}
          showSearchBar={this.state.showSearch}
        />
      </>
    );
  }
}

export default Home;
