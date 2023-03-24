import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import url from "../utils/url_config";
import ReactPlayer from 'react-player';




class ProjectDetails extends Component {
  constructor(props) {
    super(props);
  }

  addComment = async () => {
    if (this.state.comment !== "") {
      if (this.props.disableAddNew) {
        this.props.history.push(url.login);
      } else {
        let data = {
          projectId: this.props.match.params.id,
          user_id: localStorage.getItem("_id"),
          comment: this.state.comment,
        };

        await axios
          .post("http://localhost:3000/api/projects/addFeedback", data)
          .then((res) => {
            if (res.status === 200) {
              setTimeout(() => {
                toast.success("review is added successfully");

                window.location.reload();
              }, 1200);
            } else {
              toast.error("there is an error in posting your review");
            }
          })
          .catch((err) => {
            if (err.response && Array.isArray(err.response.data.messages)) {
              const msgs = err.response.data.messages.map((v) => {
                toast.error(v.msg);
              });
            }
            throw err;
          });
      }
    } else {
      toast.error("Please add comment before submitting it");
    }
  };

  ApproveProject = async () => {
    await axios
      .get(
        `http://localhost:3000/api/projects/ApproveProject/${this.props.match.params.id}`
      )
      .then((res) => {
        if (res.status == 200) {
          window.location = "/";
        }
      })
      .catch((err) => {
        if (err.response && Array.isArray(err.response.data.messages)) {
          const msgs = err.response.data.messages.map((v) =>
            toast.error(v.msg)
          );
        }
        throw err;
      });
  };

  async componentDidMount() {
    if (this.props.match.params.id === undefined) {
      window.location.reload();
    }
    await axios
      .get(
        `http://localhost:3000/api/projects/getProject/${this.props.match.params.id}`
      )
      .then((res) => {
        console.log(res.data);
        this.setState({ projectDetails: res.data });
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
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  state = { projectDetails: {}, comment: "" };
  render() {
    return (
      <>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Project Details</h3>
          </div>
          <div className="card-body">
            <div className="row">
              {/* <div className="col-12 col-md-12 col-lg-4 order-2 order-md-1">
                <div className="row">
                  <div className="col-12 col-sm-4">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text text-center text-muted">
                          Estimated budget
                        </span>
                        <span className="info-box-number text-center text-muted mb-0">
                          2300
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text text-center text-muted">
                          Total amount spent
                        </span>
                        <span className="info-box-number text-center text-muted mb-0">
                          2000
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text text-center text-muted">
                          Estimated project duration
                        </span>
                        <span className="info-box-number text-center text-muted mb-0">
                          20
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="col-12 col-md-12 col-lg-8 order-1 order-md-2">
                <h3 className="primary-heading">
                  {this.state.projectDetails.name}
                </h3>

 
                <img  style={{ width: "1000px", height: "auto"   }}
                src={this.state.projectDetails.poster} alt="Red dot" />
                <p className="text-muted">
                  {this.state.projectDetails.abstract}
                </p>
                <br />
                <div className="text-muted">
                  <h5 className="mt-5 my-heading">
                    Department
                    </h5>
                    <b className="d-block">
                      {this.state.projectDetails.department}
                    </b>
                
                  <h5 className="mt-5 my-heading">
                    Team Members
                    </h5>
                    <b className="d-block">
                      {this.state.projectDetails.teamMembers}
                    </b>
                 

                  <h5 className="mt-5 my-heading">
                    Demo Video
                    </h5>
                   <div>
                   <ReactPlayer url={this.state.projectDetails.demoVideo}/>
    </div>

                    {/* <b className="d-block">
                      <iframe
                        width={630}
                        height={345}
                        src={this.state.projectDetails.demoVideo}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      /> */}
                              
                    {/* </b> */}
                 

                  <h5 className="mt-5 my-heading">
                    Artfack Link
                    </h5>
                    <b className="d-block">
                      {" "}
                      <a
                        href={this.state.projectDetails.artfactLink}
                        target="_blank"
                      >
                        {this.state.projectDetails.artfactLink}
                      </a>
                    </b>
                  

                  {localStorage.getItem("isReviewer") &&
                  !this.state.projectDetails.isApproved ? (
                    <button
                      className="float-right custbtn"
                      onClick={() => this.ApproveProject()}
                    >
                      Approve This Project
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer card-comments">
            <div>
              <link
                href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
                rel="stylesheet"
              />
              <div className="">
                <div className="">
                  <div className="panel">
                    <div className="panel-body">
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="What are you thinking?"
                        defaultValue={""}
                        name="comment"
                        onChange={(e) => this.handleChange(e)}
                      />
                      <div className="mar-top clearfix">
                        <button
                          className="btn btn-sm btn-primary pull-right"
                          type="submit"
                          onClick={() => this.addComment()}
                        >
                          <i className="fa fa-pencil fa-fw" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="panel">
                    <div className="panel-body">
                      {this.state.projectDetails &&
                      this.state.projectDetails.feedback &&
                      this.state.projectDetails.feedback.length > 0 ? (
                        <>
                          {this.state.projectDetails.feedback.map((element) => {
                            return (
                              <>
                                <div className="media-block">
                                  <a className="media-left" href="#"></a>
                                  <div className="media-body">
                                    <div className="mar-btm">
                                      <a
                                        href="#"
                                        className="btn-link text-semibold media-heading box-inline"
                                      >
                                        {element.userId.firstname}{" "}
                                        {element.userId.lastname}
                                      </a>
                                      <p className="text-muted text-sm">
                                        {element.userId.role}
                                      </p>
                                    </div>
                                    <p>{element.comment}</p>

                                    {/* Comments */}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* /.card-body */}
        </div>
      </>
    );
  }
}

export default ProjectDetails;
