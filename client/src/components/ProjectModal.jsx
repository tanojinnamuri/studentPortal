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
    demoVideo: null,
    artfactLink: "",
    teamMembers: "",
    department: "",
    year: "",
    file: null,
    presenterFirstName: "",
    presenterLastName: "",
    homeTown: "",
    studentStatus: "",
    studentIdNumber: "",
    studentEmail: "",
    presenter: "",
    presentationFormat: "",
    presentationArea: "",
    superVisorFirstname: "",
    superVisorLastname: "",
    superVisorEmail: "",
    presenterSignatureFirstname: "",
    presenterSignatureLastname: "",
    departmentList : []
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };


  async componentDidMount() {
    await this.getdepartmentList();
  }


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

  async getdepartmentList() {
    await axios
      .get("http://localhost:3000/api/departments/getAll")
      .then((res) => {
        let data = [];

        this.setState({ departmentList: res.data });
      })
      .catch((err) => {
        throw err;
      });
  }

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

  async handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", this.state.demoVideo);
    formData.append("name", this.state.name);
    formData.append("abstract", this.state.abstract);
    formData.append("poster", this.state.poster);
    formData.append("artfactLink", this.state.artfactLink);
    formData.append("teamMembers", this.state.teamMembers);
    formData.append("department", this.state.department.trim());
    formData.append("year", this.state.year);
    formData.append("submittedBy", localStorage.getItem("_id"));
    formData.append("presenterFirstName", this.state.presenterFirstName);
    formData.append("presenterLastName", this.state.presenterLastName.trim());
    formData.append("homeTown", this.state.homeTown);
    formData.append("studentStatus", this.state.studentStatus);
    formData.append("studentIdNumber", this.state.studentIdNumber);
    formData.append("studentEmail", this.state.studentEmail);
    formData.append("presenter", this.state.presenter);
    formData.append("presentationFormat", this.state.presentationFormat);
    formData.append("presentationArea", this.state.presentationArea);
    formData.append("superVisorFirstname", this.state.superVisorFirstname);
    formData.append("superVisorLastname", this.state.superVisorLastname);
    formData.append("superVisorEmail", this.state.superVisorEmail);
    formData.append(
      "presenterSignatureFirstname",
      this.state.presenterSignatureFirstname
    );
    formData.append(
      "presenterSignatureLastname",
      this.state.presenterSignatureLastname
    );
    // {
    //   name: this.state.name,
    //   abstract: this.state.abstract,
    //   poster: this.state.poster,
    //   demoVideo: this.state.demoVideo,
    //   artfactLink: this.state.artfactLink,
    //   teamMembers: this.state.teamMembers,
    //   department: this.state.department.trim(),
    //   year: this.state.year,
    //   submittedBy: localStorage.getItem("_id"),
    //   presenterFirstName: this.state.presenterFirstName,
    //   presenterLastName: this.state.presenterLastName,
    //   homeTown: this.state.homeTown,
    //   studentStatus: this.state.studentStatus,
    //   studentIdNumber: this.state.studentIdNumber,
    //   studentEmail: this.state.studentEmail,
    //   presenter: this.state.presenter,
    //   presentationFormat: this.state.presentationFormat,
    //   presentationArea: this.state.presentationArea,
    //   superVisorFirstname: this.state.superVisorFirstname,
    //   superVisorLastname: this.state.superVisorLastname,
    //   superVisorEmail: this.state.superVisorEmail,
    //   presenterSignatureFirstname: this.state.presenterSignatureFirstname,
    //   presenterSignatureLastname: this.state.presenterSignatureLastname,
    // }
    await axios
      .post("http://localhost:3000/api/projects/add", formData)
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
            year:  new Date().getFullYear(),
          });
          window.location.href = "/";
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

  handleFileInput = (event) => {
    this.setState({ demoVideo: event.target.files[0] });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const {  departmentList} = this.state;
    let options = null;

      options = departmentList.map((option) => (
        <option key={option.DepartmentId} value={option.value}>
          {option.DepartmentName}
        </option>
      ));
    return (
      <>
        {/* <Button
          className="float-right custbtn"
          
          onClick={() => this.handleShow()}
        >
          Add new Project
        </Button>

        <Modal show={this.state.show} onHide={() => this.handleClose()}> */}
        {/* <div className="container">
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
                  <option value="Select your department ......">
                    Select your department ......
                  </option>
                  <option value="ComputerScience">Computer Science</option>
                  <option value="Biology">BioLogy</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Economics">Economics</option>
                  <option value="Information Science">
                    Information Science
                  </option>
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
              <Button className="float-right custbtn" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </div> */}

        {/* </Modal> */}

        <form className="jotform-form" onSubmit={(e) => this.handleSubmit(e)}>
          <div role="main" className="form-all">
            <style
              dangerouslySetInnerHTML={{
                __html:
                  "\n          .formLogoWrapper {\n            display: inline-block;\n            position: absolute;\n            width: 100%;\n          }\n\n          .form-all:before {\n            background: none !important;\n          }\n\n          .formLogoWrapper.Center {\n            top: -239px;\n            text-align: center;\n          }\n        ",
              }}
            />
            <ul className="form-section page-section">
              <li
                id="cid_1"
                className="form-input-wide"
                data-type="control_head"
              >
                <div className="form-header-group header-large">
                  <div className="header-text httac htvam">
                    <h1
                      id="header_1"
                      className="form-header"
                      data-component="header"
                    >
                      Add New Project
                    </h1>
                  </div>
                </div>
              </li>
              <li className="a11y_requirement_desc_line">
                <legend id="requirement_description_0">
                  All fields marked with * are required and must be filled.
                </legend>
              </li>
              <li
                className="form-line"
                data-type="control_text"
                id="id_256"
                question-order={1}
              >
                <div
                  id="cid_256"
                  className="form-input-wide"
                  data-layout="full"
                >
                  <div
                    id="text_256"
                    className="form-html"
                    data-component="text"
                    tabIndex={0}
                  >
                    <h2>
                      <strong>Instructions</strong>
                    </h2>
                    <p>
                      <em>
                        <strong>
                          Key Information you should have
                          <span style={{ textDecoration: "underline" }}>
                            before starting
                          </span>
                          this form.&nbsp;
                        </strong>
                      </em>
                    </p>
                  </div>
                </div>
              </li>
              <li
                id="cid_10"
                className="form-input-wide"
                data-type="control_head"
              >
                <div className="form-header-group header-default">
                  <div className="header-text httal htvam">
                    <h2
                      id="header_10"
                      className="form-header"
                      data-component="header"
                    >
                      Presenter Information
                    </h2>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required calculatedOperand"
                data-type="control_fullname"
                id="id_12"
                question-order={2}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_12"
                  htmlFor
                >
                  Presenter Name
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_12"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div>
                    <span
                      className="form-sub-label-container"
                      style={{ verticalAlign: "top" }}
                      data-input-type="first"
                    >
                      <input
                        type="text"
                        id="first_12"
                        name="presenterFirstName"
                        className="form-textbox validate[required]"
                        onChange={(e) => this.handleChange(e)}
                        required
                      />
                      <label
                        className="form-sub-label"
                        htmlFor="first_12"
                        id="sublabel_12_first"
                        style={{ minHeight: "13px" }}
                        aria-hidden="false"
                      >
                        First Name
                      </label>
                    </span>
                    <span
                      className="form-sub-label-container"
                      style={{ verticalAlign: "top" }}
                      data-input-type="last"
                    >
                      <input
                        type="text"
                        id="last_12"
                        name="presenterLastName"
                        className="form-textbox validate[required]"
                        size={15}
                        onChange={(e) => this.handleChange(e)}
                        required
                      />
                      <label
                        className="form-sub-label"
                        htmlFor="last_12"
                        id="sublabel_12_last"
                        style={{ minHeight: "13px" }}
                        aria-hidden="false"
                      >
                        Last Name
                      </label>
                    </span>
                  </div>
                </div>
              </li>
              <li
                className="form-line"
                data-type="control_address"
                id="id_239"
                question-order={3}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_239"
                  htmlFor
                >
                  Hometown
                </label>
                <div
                  id="cid_239"
                  className="form-input-wide"
                  data-layout="full"
                >
                  <div
                    summary
                    className="form-address-table jsTest-addressField"
                  >
                    <div className="form-address-line-wrapper jsTest-address-line-wrapperField">
                      <span className="form-address-line form-address-city-line jsTest-address-lineField">
                        <span
                          className="form-sub-label-container"
                          style={{ verticalAlign: "top" }}
                        >
                          <input
                            type="text"
                            id="input_239_city"
                            name="homeTown"
                            className="form-textbox form-address-city"
                            onChange={(e) => this.handleChange(e)}
                            required
                          />
                          <label
                            className="form-sub-label"
                            htmlFor="input_239_city"
                            id="sublabel_239_city"
                            style={{ minHeight: "13px" }}
                            aria-hidden="false"
                          >
                            City, State
                          </label>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_184"
                question-order={4}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_184"
                  htmlFor="input_184"
                >
                  What is your Student Status?
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_184"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div
                    className="form-single-column"
                    role="group"
                    aria-labelledby="label_184"
                    data-component="radio"
                  >
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_184"
                        className="form-radio validate[required]"
                        id="input_184_0"
                        name="studentStatus"
                        onChange={(e) => this.handleChange(e)}
                        value="Undergraduate Student"
                        checked={
                          this.state.studentStatus == "Undergraduate Student"
                        }
                        required
                      />
                      <label id="label_input_184_0" htmlFor="input_184_0">
                        Undergraduate Student
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        className="form-radio validate[required]"
                        name="studentStatus"
                        id="input_184_1"
                        onChange={(e) => this.handleChange(e)}
                        value="Master's Student"
                        checked={this.state.studentStatus == "Master's Student"}
                        required
                      />
                      <label id="label_input_184_1" htmlFor="input_184_1">
                        Master's Student
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        className="form-radio validate[required]"
                        name="studentStatus"
                        id="input_184_2"
                        onChange={(e) => this.handleChange(e)}
                        checked={
                          this.state.studentStatus == "Certificate Student"
                        }
                        value="Certificate Student"
                        required
                      />
                      <label id="label_input_184_2" htmlFor="input_184_2">
                        Certificate Student
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        className="form-radio validate[required]"
                        name="studentStatus"
                        id="input_184_3"
                        onChange={(e) => this.handleChange(e)}
                        checked={this.state.studentStatus == "PhD Student"}
                        value="PhD Student"
                        required
                      />
                      <label id="label_input_184_3" htmlFor="input_184_3">
                        PhD Student
                      </label>
                    </span>
                  </div>
                </div>
              </li>
              <li
                className="form-line form-line-column form-col-1 jf-required"
                data-type="control_textbox"
                id="id_14"
                question-order={5}
              >
                <label
                  className="form-label form-label-top"
                  id="label_14"
                  htmlFor
                >
                  Student ID Number
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_14"
                  className="form-input-wide jf-required"
                  data-layout="half"
                >
                  <span
                    className="form-sub-label-container"
                    style={{ verticalAlign: "top" }}
                  >
                    <input
                      type="text"
                      className="form-textbox validate[required, Fill Mask]"
                      style={{ width: "310px" }}
                      size={310}
                      required
                      tabIndex={0}
                      inputMode="text"
                      maskvalue="#########"
                      name="studentIdNumber"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <label
                      className="form-sub-label"
                      htmlFor="input_14"
                      id="sublabel_input_14"
                      style={{ minHeight: "13px" }}
                      aria-hidden="false"
                    >
                      Example: 001234567
                    </label>
                  </span>
                </div>
              </li>
              <li
                className="form-line form-line-column form-col-2 jf-required"
                data-type="control_email"
                id="id_15"
                question-order={6}
              >
                <label
                  className="form-label form-label-top"
                  id="label_15"
                  htmlFor
                >
                  Email
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_15"
                  className="form-input-wide jf-required"
                  data-layout="half"
                >
                  <span
                    className="form-sub-label-container"
                    style={{ verticalAlign: "top" }}
                  >
                    <input
                      type="email"
                      name="studentEmail"
                      onChange={(e) => this.handleChange(e)}
                      className="form-textbox validate[required, Email, disallowFree]"
                      style={{ width: "310px" }}
                      size={310}
                      required
                    />
                    <label
                      className="form-sub-label"
                      htmlFor="input_15"
                      id="sublabel_input_15"
                      style={{ minHeight: "13px" }}
                      aria-hidden="false"
                    >
                      ddane@albany.edu
                    </label>
                  </span>
                </div>
              </li>
              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_56"
                question-order={12}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_56"
                  htmlFor="input_56"
                >
                  Are you the sole presenter for this presentation?
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_56"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div
                    className="form-single-column"
                    role="group"
                    aria-labelledby="label_56"
                    data-component="radio"
                  >
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        className="form-radio validate[required]"
                        name="presenter"
                        id="input_56_0"
                        onChange={(e) => this.handleChange(e)}
                        value="Yes, I will be presenting independently"
                        required
                      />
                      <label id="label_input_56_0" htmlFor="input_56_0">
                        Yes, I will be presenting independently
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        className="form-radio validate[required]"
                        name="presenter"
                        id="input_56_1"
                        onChange={(e) => this.handleChange(e)}
                        value="No, I will be presenting with a group of students (1-6 total presenters)"
                        required
                      />
                      <label id="label_input_56_1" htmlFor="input_56_1">
                        No, I will be presenting with a group of students (1-6
                        total presenters)
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_56"
                        className="form-radio validate[required]"
                        name="presenter"
                        id="input_56_2"
                        onChange={(e) => this.handleChange(e)}
                        value="No, I will be presenting with more than 5 co-presenters (more than 6 total presenters)"
                        required
                      />
                      <label id="label_input_56_2" htmlFor="input_56_2">
                        No, I will be presenting with more than 5 co-presenters
                        (more than 6 total presenters)
                      </label>
                    </span>
                  </div>
                </div>
              </li>
              <li
                className="form-line"
                data-type="control_divider"
                id="id_36"
                question-order={14}
              >
                <div id="cid_36" className="form-input-wide" data-layout="full">
                  <div
                    className="divider"
                    data-component="divider"
                    style={{
                      borderBottomWidth: "1px",
                      borderBottomStyle: "solid",
                      borderColor: "#f3f3fe",
                      height: "1px",
                      marginLeft: "0px",
                      marginRight: "0px",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  />
                </div>
              </li>
              <li
                id="cid_55"
                className="form-input-wide"
                data-type="control_head"
              >
                <div className="form-header-group header-default">
                  <div className="header-text httal htvam">
                    <h2
                      id="header_55"
                      className="form-header"
                      data-component="header"
                    >
                      Presentation Information
                    </h2>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required calculatedOperand"
                data-type="control_textarea"
                id="id_188"
                question-order={66}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_188"
                  htmlFor="input_188"
                >
                  Presentation Title
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_188"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <textarea
                    name="name"
                    onChange={(e) => this.handleChange(e)}
                    className="form-textarea validate[required] custom-hint-group form-custom-hint"
                    style={{ width: "648px", height: "50px" }}
                    required
                    tabIndex={0}
                    placeholder="Type here..."
                  />
                </div>
              </li>
              <li
                className="form-line fixed-width jf-required calculatedOperand"
                data-type="control_textarea"
                id="id_92"
                question-order={67}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_92"
                  htmlFor="input_92"
                >
                  Presentation Abstract or Description
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <textarea
                  name="abstract"
                  onChange={(e) => this.handleChange(e)}
                  className="form-textarea validate[required] custom-hint-group form-custom-hint"
                  style={{ width: "648px", height: "50px" }}
                  data-component="textarea"
                  required
                  aria-labelledby="label_188"
                  tabIndex={0}
                  data-customhint="Type here..."
                  placeholder="Type here..."
                  spellCheck="false"
                />
              </li>
              <li
                id="cid_93"
                className="form-input-wide"
                data-type="control_head"
              >
                <div className="form-header-group header-default">
                  <div className="header-text httal htvam">
                    <h2
                      id="header_93"
                      className="form-header"
                      data-component="header"
                    >
                      Presentation Format
                    </h2>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_226"
                question-order={68}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_226"
                  htmlFor="input_226"
                >
                  Please select the Presentation format for your project
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_226"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div
                    className="form-single-column"
                    role="group"
                    aria-labelledby="label_226"
                    data-component="radio"
                  >
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_226"
                        id="input_226_0"
                        className="form-radio validate[required]"
                        name="presentationFormat"
                        onChange={(e) => this.handleChange(e)}
                        value="Art Installation"
                        required
                      />
                      <label id="label_input_226_0" htmlFor="input_226_0">
                        Art Installation
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_226"
                        className="form-radio validate[required]"
                        name="presentationFormat"
                        id="input_226_1"
                        onChange={(e) => this.handleChange(e)}
                        value="Demonstration"
                        required
                      />
                      <label id="label_input_226_1" htmlFor="input_226_1">
                        Demonstration
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_226"
                        className="form-radio validate[required]"
                        name="presentationFormat"
                        id="input_226_2"
                        onChange={(e) => this.handleChange(e)}
                        value="Oral Presentation"
                        required
                      />
                      <label id="label_input_226_2" htmlFor="input_226_2">
                        Oral Presentation
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_226"
                        id="input_226_3"
                        className="form-radio validate[required]"
                        name="presentationFormat"
                        onChange={(e) => this.handleChange(e)}
                        value="Panel Discussion"
                        required
                      />
                      <label id="label_input_226_3" htmlFor="input_226_3">
                        Panel Discussion
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_226"
                        className="form-radio validate[required]"
                        name="presentationFormat"
                        id="input_226_4"
                        onChange={(e) => this.handleChange(e)}
                        value="Performance"
                        required
                      />
                      <label id="label_input_226_4" htmlFor="input_226_4">
                        Performance
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_226"
                        className="form-radio validate[required]"
                        name="presentationFormat"
                        id="input_226_5"
                        onChange={(e) => this.handleChange(e)}
                        value="Poster Presentation"
                        required
                      />
                      <label id="label_input_226_5" htmlFor="input_226_5">
                        Poster Presentation
                      </label>
                    </span>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_223"
                question-order={69}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_223"
                  htmlFor="input_223"
                >
                  Is the work you are presenting from one of the following
                  areas?
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_223"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div
                    className="form-single-column"
                    role="group"
                    aria-labelledby="label_223"
                    data-component="radio"
                  >
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_223"
                        className="form-radio validate[required]"
                        id="input_223_0"
                        name="presentationArea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue="University at Albany Course"
                        required
                      />
                      <label id="label_input_223_0" htmlFor="input_223_0">
                        University at Albany Course
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_223"
                        className="form-radio validate[required]"
                        id="input_223_1"
                        name="presentationArea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue="Thesis/Dissertation"
                        required
                      />
                      <label id="label_input_223_1" htmlFor="input_223_1">
                        Thesis/Dissertation
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_223"
                        className="form-radio validate[required]"
                        id="input_223_2"
                        name="presentationArea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue="Internship"
                        required
                      />
                      <label id="label_input_223_2" htmlFor="input_223_2">
                        Internship
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_223"
                        className="form-radio validate[required]"
                        id="input_223_3"
                        name="presentationArea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue="Community Service/Organization"
                        required
                      />
                      <label id="label_input_223_3" htmlFor="input_223_3">
                        Community Service/Organization
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_223"
                        className="form-radio validate[required]"
                        id="input_223_4"
                        name="presentationArea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue="Research Lab/Center/Institute"
                        required
                      />
                      <label id="label_input_223_4" htmlFor="input_223_4">
                        Research Lab/Center/Institute
                      </label>
                    </span>
                    <span className="form-radio-item" style={{ clear: "left" }}>
                      <span className="dragger-item" />
                      <input
                        type="radio"
                        aria-describedby="label_223"
                        className="form-radio validate[required]"
                        id="input_223_5"
                        name="presentationArea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue="My work is not from one of these areas"
                        required
                      />
                      <label id="label_input_223_5" htmlFor="input_223_5">
                        My work is not from one of these areas
                      </label>
                    </span>
                  </div>
                </div>
              </li>

              <li
                id="cid_93"
                className="form-input-wide"
                data-type="control_head"
              >
                <div className="form-header-group header-default">
                  <div className="header-text httal htvam">
                    <h2
                      id="header_93"
                      className="form-header"
                      data-component="header"
                    >
                      Required Documents
                    </h2>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_226"
                question-order={68}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_226"
                  htmlFor="input_226"
                >
                  Please select Poster for project
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_226"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div
                    className="form-single-column"
                    role="group"
                    aria-labelledby="label_226"
                    data-component="radio"
                  >
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="file"
                        placeholder=""
                        required
                        name="poster"
                        onChange={(e) => this.handleFileInputChange(e)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </li>

              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_223"
                question-order={69}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_223"
                  htmlFor="input_223"
                >
                  demo video Link
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_223"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div className="form-single-column" role="group">
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="file"
                        placeholder=""
                        required
                        name="demoVideo"
                        onChange={(e) => this.handleFileInput(e)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </li>

              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_223"
                question-order={69}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_223"
                  htmlFor="input_223"
                >
                  artifact Link
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_223"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div className="form-single-column" role="group">
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="artfactLink"
                        onChange={(e) => this.handleChange(e)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </li>

              <li
                className="form-line jf-required"
                data-type="control_radio"
                id="id_223"
                question-order={69}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_223"
                  htmlFor="input_223"
                >
                  team Members
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_223"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div className="form-single-column" role="group">
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        placeholder=""
                        name="teamMembers"
                        onChange={(e) => this.handleChange(e)}
                      />
                    </Form.Group>
                  </div>
                </div>
              </li>
              <li
                id="cid_103"
                className="form-input-wide"
                data-type="control_head"
              >
                <div className="form-header-group header-default">
                  <div className="header-text httal htvam">
                    <h2
                      id="header_103"
                      className="form-header"
                      data-component="header"
                    >
                      Project Supervisor Information
                    </h2>
                    <div id="subHeader_103" className="form-subHeader">
                      Students must include at least one Project Supervisor.
                      Only the Primary Project Supervisor will be contacted to
                      review your submission for approval.
                    </div>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required calculatedOperand"
                data-type="control_fullname"
                id="id_104"
                question-order={83}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_104"
                  htmlFor
                >
                  Primary Project Supervisor Name
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_104"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div>
                    <span
                      className="form-sub-label-container"
                      style={{ verticalAlign: "top" }}
                      data-input-type="first"
                    >
                      <input
                        type="text"
                        name="superVisorFirstname"
                        onChange={(e) => this.handleChange(e)}
                        className="form-textbox validate[required]"
                        autoComplete="section-input_104 given-name"
                        size={10}
                        required
                      />
                      <label
                        className="form-sub-label"
                        htmlFor="first_104"
                        id="sublabel_104_first"
                        style={{ minHeight: "13px" }}
                        aria-hidden="false"
                      >
                        First Name
                      </label>
                    </span>
                    <span
                      className="form-sub-label-container"
                      style={{ verticalAlign: "top" }}
                      data-input-type="last"
                    >
                      <input
                        type="text"
                        name="superVisorLastname"
                        onChange={(e) => this.handleChange(e)}
                        className="form-textbox validate[required]"
                        autoComplete="section-input_104 family-name"
                        size={15}
                        required
                      />
                      <label
                        className="form-sub-label"
                        htmlFor="last_104"
                        id="sublabel_104_last"
                        style={{ minHeight: "13px" }}
                        aria-hidden="false"
                      >
                        Last Name
                      </label>
                    </span>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required calculatedOperand"
                data-type="control_email"
                id="id_105"
                question-order={84}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_105"
                  htmlFor="input_105"
                >
                  Primary Project Supervisor Email
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_105"
                  className="form-input-wide jf-required"
                  data-layout="half"
                >
                  <input
                    type="email"
                    name="superVisorEmail"
                    onChange={(e) => this.handleChange(e)}
                    className="form-textbox validate[required, Email]"
                    style={{ width: "310px" }}
                    size={310}
                    data-component="email"
                    aria-labelledby="label_105"
                    required
                  />
                </div>
              </li>
              <li
                className="form-line"
                data-type="control_dropdown"
                id="id_212"
                question-order={85}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_212"
                  htmlFor="input_212"
                >
                  Academic Department
                </label>
                <div
                  id="cid_212"
                  className="form-input-wide"
                  data-layout="half"
                >
                 <select
            name="department"
            className="form-control"
            value={this.state.department}
            onChange={this.handleChange}
          >
            <option value="">Select your department ......</option>
            {departmentList.map((item) => (
                <option key={item.DepartmentId} value={item.value}>
                {item.DepartmentName}
              </option>
            ))}
          </select>
                </div>
              </li>

              <li
                id="cid_114"
                className="form-input-wide"
                data-type="control_head"
              >
                <div className="form-header-group header-default">
                  <div className="header-text httal htvam">
                    <h2
                      id="header_114"
                      className="form-header"
                      data-component="header"
                    >
                      Acknowledgement
                    </h2>
                  </div>
                </div>
              </li>
              <li
                className="form-line jf-required"
                data-type="control_fullname"
                id="id_119"
                data-compound-hint=","
                question-order={91}
              >
                <label
                  className="form-label form-label-top form-label-auto"
                  id="label_119"
                  htmlFor
                >
                  Presenter Signature
                  <span
                    className="form-required"
                    aria-label="Required"
                    aria-describedby="requirement_description_0"
                  >
                    *
                  </span>
                </label>
                <div
                  id="cid_119"
                  className="form-input-wide jf-required"
                  data-layout="full"
                >
                  <div>
                    <span
                      className="form-sub-label-container"
                      style={{ verticalAlign: "top" }}
                      data-input-type="first"
                    >
                      <input
                        type="text"
                        name="presenterSignatureFirstname"
                        onChange={(e) => this.handleChange(e)}
                        className="form-textbox validate[required]"
                        autoComplete="section-input_119 given-name"
                        size={10}
                        required
                      />
                      <label
                        className="form-sub-label"
                        htmlFor="first_119"
                        id="sublabel_119_first"
                        style={{ minHeight: "13px" }}
                        aria-hidden="false"
                      >
                        First Name
                      </label>
                    </span>
                    <span
                      className="form-sub-label-container"
                      style={{ verticalAlign: "top" }}
                      data-input-type="last"
                    >
                      <input
                        type="text"
                        name="presenterSignatureLastname"
                        onChange={(e) => this.handleChange(e)}
                        className="form-textbox validate[required]"
                        size={15}
                        required
                      />
                      <label
                        className="form-sub-label"
                        htmlFor="last_119"
                        id="sublabel_119_last"
                        style={{ minHeight: "13px" }}
                        aria-hidden="false"
                      >
                        Last Name
                      </label>
                    </span>
                  </div>
                </div>
              </li>
              <li
                id="cid_2"
                className="form-input-wide"
                data-type="control_button"
              >
                <div
                  data-align="auto"
                  className="form-buttons-wrapper form-buttons-auto form-pagebreak jsTest-button-wrapperField"
                >
                  <button
                    id="input_2"
                    type="submit"
                    className="form-submit-button submit-button jf-form-buttons jsTest-submitField"
                  >
                    Submit
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </form>
      </>
    );
  }
}

export default ProjectModal;
