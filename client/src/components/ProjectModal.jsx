import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"

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
    department: "",
    year: "",
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
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
          this.handleClose();
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
          await this.props.refreshData();
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
        <Button
          className="float-right custbtn"
          
          onClick={() => this.handleShow()}
        >
          Add new Project
        </Button>

        <Modal show={this.state.show} onHide={() => this.handleClose()}>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Modal.Header closeButton>
              <Modal.Title>Add new Project</Modal.Title>
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
                  type="text"
                  placeholder=""
                  autoFocus
                  required
                  name="poster"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Demo Video</Form.Label>
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
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  required
                  name="department"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  required
                  name="year"
                  onChange={(e) => this.handleChange(e)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleClose()}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}

export default ProjectModal;
