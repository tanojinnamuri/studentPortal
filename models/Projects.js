const mongoose = require("mongoose");
const validator = require("validator");
const { APIError } = require("../helpers/error");

const projectchema = mongoose.Schema(
  {
    name: String,
    abstract: String,
    poster: {
      type: String,
    },
    demoVideo: String,
    artfactLink: String,
    teamMembers: String,
    department: String,
    year: String,
  },
  {
    timestamps: true,
  }
);

projectchema.method("createProject", async function (project) {
  let Project = this.model("Project");
  if ((await Project.findOne({ name: project.name })) !== null) {
    throw new APIError(400, "Already a same project present with same name.");
  }

  return await Project.create(project);
});

projectchema.method("getAllProjects", async function () {
  let Project = this.model("Project");

  return await Project.find();
});

module.exports = mongoose.model("Project", projectchema);
