import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import url from "../utils/url_config";
import ReactPlayer from "react-player";
import Rating from "react-rating-stars-component";
import "./projectdetails.css";

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
        <div class="parent-container">
          <div class="container1">
            <div class="image-container1">
              <img
                src={this.state.projectDetails.poster}
                className="img1"
                alt="Placeholder"
              />
            </div>
            <div class="box1">
              <h1>{this.state.projectDetails.name}</h1>
              <p>{this.state.projectDetails.abstract}</p>
            </div>
          </div>
          <div class="grid-container">
            <div class="grid-item">
              <h4>Department</h4>
              <p> {this.state.projectDetails.department}</p>
            </div>
            <div class="grid-item">
              <h4>Team Members</h4>
              <p>{this.state.projectDetails.teamMembers}</p>
            </div>{" "}
          </div>
          <div className="grid-container1">
            <div class="grid-item1">
              <h4>Artifact Source</h4>
              <p>
                {" "}
                <a
                  href={this.state.projectDetails.artfactLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {this.state.projectDetails.artfactLink}
                </a>
              </p>
            </div>
          </div>

          <div>
            <div style={{ width: "640", height: "360" }}>
              <video
                src={this.state.projectDetails.demoVideo}
                style={{ width: "100%", height: "100%" }}
                controls
                autoPlay
              />
            </div>
            <div class="comment-section">
              <div class="rating-section">
                <h3>Rate this project</h3>
                <Rating count={5} size={50} activeColor="#ffd700" />
              </div>
              <div class="comment-form">
                <h3>Leave a Comment</h3>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div class="form-group">
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="What are you thinking?"
                      defaultValue={""}
                      name="comment"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                  <button
                    className="btn custbtn1"
                    type="submit"
                    onClick={() => this.addComment()}
                  >
                    <i className="fa fa-pencil fa-fw" /> Share
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ProjectDetails;
