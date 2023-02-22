import React, { Component } from "react";
import ProjectModal from "./ProjectModal";
import { MDBDataTable } from "mdbreact";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarField from "./NavbarField";
import Button from "react-bootstrap/Button";
import url from "../utils/url_config";

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
      rows: [],
    },
  };

  async getAllData() {
    await axios
      .get("http://localhost:3000/api/projects/getAll")
      .then((res) => {
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
            rows: res.data,
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
                    <h1>Projects</h1>
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
                        <div className="row">
                          <Button
                            className="float-right custbtn"
                            onClick={() => this.handleShow()}
                          >
                            Add new Project
                          </Button>
                        </div>
                        <div className="">
                          <MDBDataTable
                            striped
                            bordered
                            small
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
