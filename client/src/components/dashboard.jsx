import React, { Component, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import url from "../utils/url_config";
import { Link } from "react-router-dom";
import "./sample.css";
import Rating from "react-rating-stars-component";

class Dashborad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      type: "",
      query: "",
      departmentOptions: [],
      yearOptions: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.filterData = this.filterData.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  async getAllData() {
    // let isReviewer = localStorage.getItem("isReviewer");
    await axios
      .get("http://localhost:3000/api/projects/getAll")
      .then((res) => {
        let data = [];

        res.data.forEach((element) => {
          if (element.isApproved) {
            let newData = element;
            newData.name = (
              <Link to={`/detail/${newData._id}`} className="projectName">
                {newData.name}
              </Link>
            );
            // newData.poster = (
            //   <Link to={`/detail/${newData._id}`} className="projectPoster">
            //     <img src={newData.poster} alt="Project Poster" />
            //   </Link>
            // );

            // newData.poster = (<Link to = {`/detail/${newData._id}`} className="projectPoster"><img src={newData.poster} alt="Red dot" /></Link>);
            newData.poster = <img src={newData.poster} alt="Red dot" />;
            newData.isApproved = element.isApproved
              ? "Approved"
              : "Not Approved";
            data.push(newData);
          }
        });

        this.setState({ projects: data });
      })
      .catch((err) => {
        if (err.response && Array.isArray(err.response.data.messages)) {
          const msgs = err.response.data.messages.map((v) =>
            toast.error(v.msgs)
          );
          console.log(msgs);
        }
        throw err;
      });
  }

  async getdepartmentList() {
    await axios
      .get("http://localhost:3000/api/departments/getAll")
      .then((res) => {
        let data = [];

        this.setState({ departmentOptions: res.data });
      })
      .catch((err) => {
        throw err;
      });
  }
  changeScreen = (id) => {
    window.location.href = `/detail/${id}`;
  };
  handleChange(e) {
    const { name, value } = e.target;
    if (name === "type") {
      this.setState({ query: "", type: value });
    } else {
      this.setState({ [name]: value });
    }
  }
  cancel = async () => {
    await this.getAllData();
  };

  filterData = async () => {
    if (this.state.type !== "" && this.state.query !== "") {
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
                {
                  label: "department",
                  field: "department",
                  sort: "asc",
                  width: 100,
                },
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
            this.setState({ projects: [] });
            console.log(msgs);
          }
          throw err;
        });
    } else {
      toast.error("please fill type and query");
    }
  };

  async componentDidMount() {
    const currentYear = new Date().getFullYear();
    let yearOptions = [];
    for (let year = 1990; year <= currentYear; year++) {
      yearOptions.push({ label: year, value: year });
    }
    this.setState({ yearOptions });
    await this.getAllData();
    await this.getdepartmentList();
  }

  handleShow = () => {
    if (this.props.disableAddNew) {
      this.props.history.push(url.login);
    } else {
      window.location.href = url.addProject;
    }
  };

  render() {
    const { projects } = this.state;
    const Project = ({ project }) => {
      const createdDate = new Date(project.created_at).toLocaleString(
        "default",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    };
    const { type, query, departmentOptions, yearOptions } = this.state;
    let options = null;
    if (type === "department") {
      options = departmentOptions.map((option) => (
        <option key={option.DepartmentId} value={option.value}>
          {option.DepartmentName}
        </option>
      ));
    } else if (type === "year") {
      options = yearOptions.map((option) => (
        <option key={option.YearId} value={option.value}>
          {option.label}
        </option>
      ));
    }
    return (
      <>
        <div>
          <nav style={{ backgroundColor: "#333", padding: "10px" }}>
            <ul>
              <li className="dashboardli">
                <a href="/videosview">Videos</a>
              </li>
              <li className="dashboardli">
                <a href="/photosview">Poster View</a>
              </li>
              <li className="dashboardli">
                <a href="/documentview">Document</a>
              </li>
            </ul>
          </nav>
          {/* Content Wrapper. Contains page content */}
          <div className="">
            {/* Content Header (Page header) */}
            <section className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-9">
                    <h1>UAlbany Showcase</h1>
                  </div>
                  <div className=" col-sm-3">
                    {this.props.disableAddNew ? (
                      <></>
                    ) : (
                      <Button
                        className="btn custbtn1"
                        onClick={() => this.handleShow()}
                      >
                        Add new Project
                      </Button>
                    )}
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
                        <div className="row m-0">
                          <div className="col-md-4 col-sm-12 col-12">
                            <label className="">Filter Type</label>
                            <span className="required-class"> *</span>
                            <div className="form-group">
                              <select
                                name="type"
                                id="cityId"
                                onChange={this.handleChange}
                                className="filter-dropdown-height react-select theme-light react-select__control filter-dropdown-height is-untouched is-pristine av-valid form-control"
                              >
                                <option value="" disabled="">
                                  Select
                                </option>
                                <option value="department">Department</option>
                                <option value="year">Year</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-12">
                            <label className="">Select {type}</label>
                            <span className="required-class"> *</span>
                            <div className="form-group">
                              <select
                                name="query"
                                className="filter-dropdown-height react-select theme-light react-select__control filter-dropdown-height is-untouched is-pristine av-valid form-control"
                                onChange={this.handleChange}
                                value={query}
                              >
                                <option value="" disabled="">
                                  Select
                                </option>
                                {options}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-4 col-12">
                            <label className="m-0">Filter</label>
                            <div className="">
                              <div className="col-12 col-md-10 p-0">
                                <div
                                  role="group"
                                  className="pull-right btn-group"
                                >
                                  <button
                                    className="btn custbtn1"
                                    onClick={this.filterData}
                                  >
                                    <i className="fa  fa-filter" />
                                    Apply
                                  </button>
                                  <button
                                    type="button"
                                    className="btn custbtn1"
                                    onClick={this.cancel}
                                  >
                                    View All
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row float-right"></div>

                        <br />
                        {/* <div className="row">
                          {this.props.disableAddNew ||
                            localStorage.getItem("isReviewer") ? (
                            <></>
                          ) : (
                            <Button
                              className="float-right custbtn"
                              onClick={() => this.handleShow()}
                            >
                              Add new Project
                            </Button>
                          )}
                        </div> */}
                        <div className="">
                          {/* <MDBDataTable
                            striped
                            bordered
                            hover
                            noBottomColumns 
                            searchLabel=""
                            data={this.state.data}
                          /> */}

                          <div className="project-list">
                            {projects.map((project) => {
                              // Convert the creation date to the desired format
                              const createdDate = new Date(
                                project.createdAt
                              ).toLocaleString("default", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              });
                              return (
                                <div className="project-card" key={project._id}>
                                  <div className="project-image">
                                    <img
                                      style={{ width: "60%", height: "40%" }}
                                      alt="poster"
                                      src={project.poster.props.src}
                                    />
                                  </div>
                                  <div className="project-details">
                                    <h2>{project.name}</h2>
                                    <div className="project-details-list">
                                      <p>
                                        <strong>Team Members:</strong>{" "}
                                        {project.teamMembers}
                                      </p>
                                      <p>
                                        <strong>Professor:</strong>{" "}
                                        {project.superVisorFirstname} {project.superVisorLastname}
                                      </p>
                                      <Rating count={5} size={30} activeColor="#ffd700" />
                                    </div>
                                    <div className="project-description">
                                      <p>{project.description}</p>
                                    </div>
                                  </div>
                                </div>
                                /* <div className="video">
                                    <video style={{width:"300px"}} src={"http://localhost:3000/" + project.demoVideo} autoPlay controls/>
                            </div> */
                              );
                            })}
                          </div>

                          {/* <div className="project-list">
                            {projects.map((project) => {
                              // Convert the creation date to the desired format
                              const createdDate = new Date(
                                project.createdAt
                              ).toLocaleString("default", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              });
                              return (
                                <div className="project-card" key={project._id}>
                                  <div className="project-details">
                                    <div className="video">
                                      <video
                                        style={{ width: "600px" }}
                                        src={project.demoVideo}
                                        autoPlay
                                        controls
                                        muted
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div> */}
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
