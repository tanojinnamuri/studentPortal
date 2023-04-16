import React, { Component } from "react";
import NavbarField from "./NavbarField";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

class DocumentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      type: "",
      query: "",
      departmentOptions: [],
      yearOptions: [],
    };
  }

  async componentDidMount() {
    await this.getAllData();
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
  render() {
    return (
      <>
        <NavbarField showSearch={false} />
        <div>
          <div className="project-list">
            {this.state.projects.map((project) => {
              // Convert the creation date to the desired format
              const createdDate = new Date(project.createdAt).toLocaleString(
                "default",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              );
              return (
                <div className="project-card" key={project._id}>
                  <div className="project-details">
                    <div className="video">
                      <embed
                        src={project.singledocument}
                        title="PDF Viewer"
                        width="500px"
                        height="500px"
                        type="application/pdf"
                      />
                      {/* <video
                        style={{ width: "600px" }}
                        src={project.demoVideo}
                        autoPlay
                        controls
                        muted
                      /> */}
                      <h4>{project.name}</h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default DocumentView;
