import React, { Component } from 'react';
import NavbarField from "./NavbarField";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import './photosview.css'
;
class PhotosView extends Component {
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
        const { projects } = this.state;
        return (
            <>
                <NavbarField showSearch={false} />
                <div>

                    <div className="project-list1">
                        {projects.map((project) => {
                            return (
                                <div className="project-card1" key={project._id}>
                                    <div className="project-details1">
                                        <div className="project-image1">
                                            <img src={project.poster.props.src} alt="Project Poster"
                                                />

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

export default PhotosView;
