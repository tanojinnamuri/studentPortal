import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import url from "../utils/url_config";
import Rating from "react-rating-stars-component";
import "./projectdetails.css";
import DownloadLink from "./DownloadLink";

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
      this.state = {
        projectDetails: {},
        comment: "",
        rating: 0,
        showShare: false,
        showApprove: true, // Define the state variable here
      };
    }

  addComment = async () => {
    if (this.state.comment !== "" && this.state.rating != 0) {
      if (this.props.disableAddNew) {
        this.props.history.push(url.login);
      } else {
        let data = {
          projectId: this.props.match.params.id,
          user_id: localStorage.getItem("_id"),
          comment: this.state.comment,
          rating: this.state.rating,
        };

        await axios
          .post("/api/projects/addFeedback", data)
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
        `/api/projects/ApproveProject/${this.props.match.params.id}`
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
  RejectProject = async () => {
    await axios
      .get(
        `/api/projects/RejectProject/${this.props.match.params.id}`
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

  changeRating = (e) => {
    this.setState({ rating: e });
  };

  async componentDidMount() {
    if (this.props.match.params.id === undefined) {
      window.location.reload();
    }

    await axios
      .get(
        `/api/projects/getProject/${this.props.match.params.id}`
      )
      .then((res) => {
        this.setState({ projectDetails: res.data });
        const loginemail = localStorage.getItem("email");
        if(loginemail === undefined || loginemail === null || localStorage.getItem("isReviewer") === true ||
        localStorage.getItem("_id") === null || localStorage.getItem("_id") === undefined ){
          this.setState({showApprove : false});
        }
       if(loginemail !== undefined && loginemail !== null){
         if(loginemail !== res.data.superVisorEmail){
          this.setState({showApprove : false});
         }
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
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  render() {
    return (
      <>


        <div className="parent-container">
          <div className="container1">
            <div className="image-container1">
              <img
                src={this.state.projectDetails.poster}
                className="img1"
                alt="Placeholder"
              />

            </div>



            <div className="box1">
              <h1>{this.state.projectDetails.name}</h1>
            </div>
          </div>
          <div style={{ paddingBottom: "50px" }}>
            <div className="projectmain">
            <div className="row">
              <div className="col-sm-3">
                <div className="card1">
                  <div className="card-body1">
                    <h5 className="card-title1 text-center">Department</h5>
                    <p className="card-text1">{this.state.projectDetails.department}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card1">
                  <div className="card-body1">
                    <h5 className="card-title1">Team Members</h5>
                    <p className="card-text1">{this.state.projectDetails.teamMembers}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card1">
                  <div className="card-body1">
                    <h5 className="card-title1">Artifact Source</h5>
                    <p className="card-text1">  <a
                      href={this.state.projectDetails.artfactLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {this.state.projectDetails.artfactLink}
                    </a></p>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="card1">
                  <div className="card-body1 text-center">
                    <h5 className="card-title1">Documents</h5>
                    <p>
                      {this.state.projectDetails.singledocument ? (
                        <>
                          <DownloadLink
                            base64String={this.state.projectDetails.singledocument}
                            filename={"project details"}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </p>
                    <p>
                      {this.state.projectDetails.otherdocument &&
                        this.state.projectDetails.otherdocument.length > 0 ? (
                        <>
                          {this.state.projectDetails.otherdocument.map((doc) => {
                            return (
                              <DownloadLink
                                base64String={doc}
                                filename={"other document"}
                              />
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>

                </div>
              </div>
            </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="card1">
                  <div className="card-body1">
                    <h5 className="card-title1">Description</h5>
                    <p className="card-text1">{this.state.projectDetails.abstract}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>


          <div>
            <div style={{ width: "140", height: "260" }}>
              <div
                style={{
                  border: "13px solid #ddd",
                  marginLeft: "250px",
                  marginRight: "250px",
                }}
              >
                <video
                  src={this.state.projectDetails.demoVideo}
                  style={{ width: "100%", height: "80%" }}
                  controls
                  autoPlay
                  muted
                />
              </div>

       
            </div>
            {this.state.showApprove == true ? (
              <div className="container2">
                <div className="row">
                  <div className="col-md-6">
                  <button
                        className="btn custbtn1"
                        type="submit"
                        onClick={() => this.ApproveProject()}
                      >Approve
                      </button>
                    
                  </div>
                  <div className="col-md-6">
                  <button
                        className="btn custbtn1"
                        type="submit"
                        onClick={() => this.RejectProject()}
                      >Reject
                      </button>
                  </div>
                </div>
              </div>
             

            ) : (<></>)}

            <div
              className="comment-section"
              style={{
                border: "13px solid #ddd",
                marginLeft: "30px",
                marginRight: "30px",
                padding: "30px",
              }}
            >
              <div className="rating-section">
                <h4>Rate this project</h4>
                <Rating
                  count={5}
                  size={30}
                  activeColor="#ffd700"
                  onChange={(e) => this.changeRating(e)}
                />
              </div>
              <div className="comment-form">
                <h4>Leave a Comment</h4>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="What are you thinking?"
                      defaultValue={""}
                      name="comment"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                  {this.state.comment.length > 0 && this.state.rating != 0 ? (
                    <>
                      <button
                        className="btn custbtn1"
                        type="submit"
                        onClick={() => this.addComment()}
                      >
                        <i className="fa fa-pencil fa-fw" /> Share
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </form>
                {this.state.projectDetails.feedback &&
                  this.state.projectDetails.feedback.length > 0 ? (
                  <>
                    {this.state.projectDetails.feedback.map((fee) => {
                      return (
                        <>
                          <div className="container">
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-md-10">
                                    <p>
                                      <a
                                        className="float-left"
                                        href="#"
                                        style={{ color: "black" }}
                                      >
                                        <strong>
                                          {fee.userId.firstname}{" "}
                                          {fee.userId.lastname}
                                        </strong>
                                      </a>
                                    </p>
                                    <br />
                                    <Rating
                                      count={5}
                                      size={20}
                                      value={fee.rating}
                                      edit={false}
                                      activeColor="#ffd700"
                                    />
                                    <div className="clearfix" />
                                    <p>{fee.comment}</p>
                                  </div>
                                </div>
                              </div>
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
      </>
    );
  }
}

export default ProjectDetails;
