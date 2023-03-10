import React, { Component } from "react";
import ProjectModal from "./ProjectModal";
import { MDBDataTable } from "mdbreact";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarField from "./NavbarField";
import Button from "react-bootstrap/Button";
import url from "../utils/url_config";
import { Link } from "react-router-dom";

class Dashborad extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150,
          headerStyle: {
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#46166B",
            color: "white",
          },
        },
        {
          label: "Abstract",
          field: "abstract",
          sort: "asc",
          width: 270,
          headerStyle: {
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#46166B",
            color: "white",
          },
        },
        // {
        //   label: "Poster",
        //   field: "poster",
        //   sort: "asc",
        //   width: 200,
        // },
        // {
        //   label: "Demo Video",
        //   field: "demoVideo",
        //   sort: "asc",
        //   width: 100,
        // },
        // {
        //   label: "artfact Link",
        //   field: "artfactLink",
        //   sort: "asc",
        //   width: 150,
        // },
        {
          label: "Team Members",
          field: "teamMembers",
          sort: "asc",
          width: 150,
          headerStyle: {
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#46166B",
            color: "white",
          },
        },
        // ,
        // {
        //   label: "department",
        //   field: "department",
        //   sort: "asc",
        //   width: 100,
        // },
        // ,
        // {
        //   label: "year",
        //   field: "year",
        //   sort: "asc",
        //   width: 100,

        // },
      ],
      rows: [],
    },
    type: "",
    query: "",
  };

  async getAllData() {
    await axios
      .get("http://localhost:3000/api/projects/getAll")
      .then((res) => {
        let data = [];

        res.data.forEach((element) => {
          let newData = element;
          newData.name = (
            <Link to={`/detail/${newData._id}`}>{newData.name}</Link>
          );
          newData.poster = <img src={newData.poster} alt="Red dot" />;

          if (localStorage.getItem("isReviewer") === true) {
            newData.action = <button>Approve</button>;
          }

          data.push(newData);
        });
        let col = [
          {
            label: "Name",
            field: "name",
            sort: "asc",
            width: 150,
            headerStyle: {
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor: "#46166B",
              color: "white",
            },
          },
          {
            label: "Abstract",
            field: "abstract",
            sort: "asc",
            width: 270,
            headerStyle: {
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor: "#46166B",
              color: "white",
            },
          },
          // {
          //   label: "Poster",
          //   field: "poster",
          //   sort: "asc",
          //   width: 200,
          // },
          // {
          //   label: "Demo Video",
          //   field: "demoVideo",
          //   sort: "asc",
          //   width: 100,
          // },
          // {
          //   label: "artfact Link",
          //   field: "artfactLink",
          //   sort: "asc",
          //   width: 150,
          // },
          {
            label: "Team Members",
            field: "teamMembers",
            sort: "asc",
            width: 150,
            headerStyle: {
              fontSize: "18px",
              fontWeight: "bold",
              backgroundColor: "#46166B",
              color: "white",
            },
          },
          // ,
          // {
          //   label: "department",
          //   field: "department",
          //   sort: "asc",
          //   width: 100,
          // },
          // ,
          // {
          //   label: "year",
          //   field: "year",
          //   sort: "asc",
          //   width: 100,
          // },
        ];

        this.setState({
          data: {
            columns: col,
            rows: data,
          },
        });
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

  changeScreen = (id) => {
    window.location.href = `/detail/${id}`;
  };
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  cancel = async () => {
    await this.getAllData();
  };

  filterData = async () => {
    if (this.state.type != "" && this.state.query != "") {
      await axios
        .get(
          `http://localhost:3000/api/projects/getProject/${this.state.type}/${this.state.query}`
        )
        .then((res) => {
          let data = [];

          res.data.forEach((element) => {
            let newData = element;
            newData.name = (
              <Link
                style={{ fontWeight: "bold" }}
                onClick={() => this.changeScreen(element._id)}
              >
                {newData.name}
              </Link>
            );
            newData.poster = <img src={newData.poster} alt="Red dot" />;

            data.push(newData);
          });

          this.setState({
            data: {
              columns: [
                {
                  label: "Name",
                  field: "name",
                  sort: "asc",
                  width: 150,
                },
                {
                  label: "Abstract",
                  field: "abstract",
                  sort: "asc",
                  width: 270,
                },
                {
                  label: "Poster",
                  field: "poster",
                  sort: "asc",
                  width: 200,
                },
                {
                  label: "Demo Video",
                  field: "demoVideo",
                  sort: "asc",
                  width: 100,
                },
                {
                  label: "artfact Link",
                  field: "artfactLink",
                  sort: "asc",
                  width: 150,
                },
                {
                  label: "Team Members",
                  field: "teamMembers",
                  sort: "asc",
                  width: 150,
                },
                ,
                {
                  label: "department",
                  field: "department",
                  sort: "asc",
                  width: 100,
                },
                ,
                {
                  label: "year",
                  field: "year",
                  sort: "asc",
                  width: 100,
                },
              ],
              rows: data,
            },
          });
        })
        .catch((err) => {
          if (err.response && Array.isArray(err.response.data.messages)) {
            const msgs = err.response.data.messages.map((v) =>
              toast.error(v.msg)
            );
          }
          throw err;
        });
    } else {
      toast.error("please fill type and query");
    }
  };

  async componentDidMount() {
    await this.getAllData();
  }

  handleShow = () => {
    if (this.props.disableAddNew) {
      this.props.history.push(url.login);
    } else {
      window.location.href = url.addProject;
    }
  };
  render() {
    return (
      <>
        <div>
          {/* Content Wrapper. Contains page content */}
          <div className="">
            {/* Content Header (Page header) */}
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1>UAlbany Projects</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      <li className="breadcrumb-item">
                        <a href="#">Home</a>
                      </li>
                      <li className="breadcrumb-item active">Projects</li>
                    </ol>
                  </div>
                </div>
              </div>
              {/* /.container-fluid */}
            </section>
            {/* Main content */}
            <section className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Submitted Projects</h3>
                      </div>
                      {/* /.card-header */}
                      <div className="card-body">
                        {this.props.showSearchBar ? (
                          <div className="row m-0">
                            <div className="col-md-4 col-sm-12 col-12">
                              <label className="">Type</label>
                              <span className="required-class"> *</span>
                              <div className="form-group">
                                <select
                                  name="type"
                                  id="cityId"
                                  onChange={(e) => this.handleChange(e)}
                                  className="filter-dropdown-height react-select theme-light react-select__control filter-dropdown-height is-untouched is-pristine av-valid form-control"
                                >
                                  <option value="" disabled="">
                                    Select
                                  </option>
                                  <option value={"department"}>
                                    Department
                                  </option>
                                  <option value={"year"}>Year</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-12">
                              <label className="">Query</label>
                              <span className="required-class"> *</span>
                              <div className="form-group">
                                {this.state.type == "department" ? (
                                  <>
                                    <select
                                      name="query"
                                      className="filter-dropdown-height react-select theme-light react-select__control filter-dropdown-height is-untouched is-pristine av-valid form-control"
                                      onChange={(e) => this.handleChange(e)}
                                    >
                                      <option value={""}>value</option>
                                      <option value="ComputerScience">
                                        Computer Science
                                      </option>
                                      <option value="Biology">BioLogy</option>
                                      <option value="Chemistry">
                                        Chemistry
                                      </option>
                                      <option value="Physics">Physics</option>
                                      <option value="Data Science">
                                        Data Science
                                      </option>
                                      <option value="Economics">
                                        Economics
                                      </option>
                                      <option value="Information Science">
                                        Information Science
                                      </option>
                                    </select>
                                  </>
                                ) : (
                                  <input
                                    name="query"
                                    id="title"
                                    type="text"
                                    onChange={(e) => this.handleChange(e)}
                                    className="filter-dropdown-height react-select theme-light react-select__control filter-dropdown-height is-untouched is-pristine av-valid form-control"
                                    value={this.state.query}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-12">
                              <label className="m-0">Action</label>
                              <div className="">
                                <div className="col-12 col-md-10 p-0">
                                  <div
                                    role="group"
                                    className="pull-right btn-group"
                                  >
                                    <button
                                      className="btn btn-success"
                                      onClick={() => this.filterData()}
                                    >
                                      <i className="fa  fa-filter" />
                                      Apply
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      onClick={() => this.cancel()}
                                    >
                                      View All
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}

                        <div className="row float-right"></div>

                        <br />
                        <div className="row">
                          {this.props.disableAddNew ? (
                            <></>
                          ) : (
                            <Button
                              className="float-right custbtn"
                              onClick={() => this.handleShow()}
                            >
                              Add new Project
                            </Button>
                          )}
                        </div>
                        <div className="">
                          <MDBDataTable
                            striped
                            bordered
                            hover
                            data={this.state.data}
                          />
                        </div>
                      </div>
                      {/* /.card-body */}
                    </div>
                  </div>
                  {/* /.col */}
                </div>
                {/* /.row */}
              </div>
              {/* /.container-fluid */}
            </section>
            {/* /.content */}
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
        </div>
        {/* /.content-wrapper */}
      </>
    );
  }
}

export default Dashborad;
