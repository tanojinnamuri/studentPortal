import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import url from "../utils/url_config";

class ProjectModal extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    show: false,
    name: "",
    abstract: "",
    poster: "",
    demoVideo: "",
    artfactLink: "",
    teamMembers: "",
    department: "ComputerScience",
    year: "",
    file: null,
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  handleFileInputChange = (e) => {
    console.log(e.target.files[0]);
    let { file } = this.state;

    file = e.target.files[0];

    this.getBase64(file)
      .then((result) => {
        file["base64"] = result;
        console.log("File Is", file);
        this.setState({
          poster: result,
          file,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({
      file: e.target.files[0],
    });
  };

  handleSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:3000/api/projects/add", {
        name: this.state.name,
        abstract: this.state.abstract,
        poster: this.state.poster,
        demoVideo: this.state.demoVideo,
        artfactLink: this.state.artfactLink,
        teamMembers: this.state.teamMembers,
        department: this.state.department,
        year: this.state.year,
      })
      .then(async (res) => {
        if (res.data === "OK") {
          toast.success("Project added successfully");

          this.setState({
            show: false,
            name: "",
            abstract: "",
            poster: "",
            demoVideo: "",
            artfactLink: "",
            teamMembers: "",
            department: "",
            year: "",
          });
          window.location.href = url.dashboard;
        } else {
          toast.error("There is an issue in saving the project");
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
        {/* <Button
          className="float-right custbtn"
          
          onClick={() => this.handleShow()}
        >
          Add new Project
        </Button>

        <Modal show={this.state.show} onHide={() => this.handleClose()}> */}
        <div className="container">
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Modal.Header>
              <Modal.Title className="text-center">Add new Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  required
                  name="name"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Abstract</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  required
                  name="abstract"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Project Poster</Form.Label>
                <Form.Control
                  type="file"
                  placeholder=""
                  autoFocus
                  required
                  name="poster"
                  onChange={(e) => this.handleFileInputChange(e)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Demo Video Link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  required
                  name="demoVideo"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Artifact link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  name="artfactLink"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>team members</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  name="teamMembers"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Department</Form.Label>
                <Form.Select
                  autoFocus
                  required
                  name="department"
                  onChange={(e) => this.handleChange(e)}
                >
                  <option value="Select your department ......">Select your department ......</option>
                  <option value="ComputerScience">Computer Science</option>
                  <option value="Biology">BioLogy</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Economics">Economics</option>
                  <option value="Information Science">Information Science</option>
                </Form.Select>
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  placeholder=""
                  autoFocus
                  required
                  name="year"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button  className="float-right custbtn" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </div>

        {/* </Modal> */}
      </>
    );
  }
}

export default ProjectModal;
