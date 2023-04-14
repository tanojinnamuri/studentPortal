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
        <NavbarField />
        <Dashborad
          disableAddNew={true}
          {...this.props}
          showSearchBar={this.state.showSearch}
        />
        <footer className="footer container-fluid">
          <div className="region region-footer">
            <section
              id="block-footer2020-2"
              data-block-plugin-id="block_content:58324575-ecf1-412b-b839-09d0cf593aef"
              className="block block-block-content block-block-content58324575-ecf1-412b-b839-09d0cf593aef clearfix"
            >
              <div className="field field--name-body field--type-text-with-summary field--label-hidden field--item">
                <div className="footer-new"></div>
                <div className="footer-end">
                  <div className="row">
                    <div className="col-sm-12 col-md-6 address-phone">
                      <a
                        href="https://www.google.com/maps/place/1400+Washington+Ave,+Albany,+NY+12222/@42.6859115,-73.8287166,17z/data=!3m1!4b1!4m5!3m4!1s0x89de0b3ce5c93e45:0x4cdbe8d7b52fa412!8m2!3d42.6859115!4d-73.8265279"
                        target="_blank" rel="noreferrer"
                      >
                        1400 Washington Avenue, Albany, NY 12222
                      </a>{" "}
                      | Phone: <a href="tel:5184423300">518-442-3300</a>
                    </div>
                    <div className="col-sm-12 col-md-6 copyright">
                      © 2023 University at Albany |
                      <a href="/accessibility">Accessibility</a> |
                      <a href="https://wiki.albany.edu/display/public/askit/Internet+Privacy+Policy">
                        Privacy Policy
                      </a>{" "}
                      |<a href="/equity-compliance/">Title IX</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </footer>
      </>
    );
  }
}

export default Home;
