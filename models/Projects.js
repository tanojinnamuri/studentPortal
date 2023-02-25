const mongoose = require("mongoose");
const validator = require("validator");
const { APIError } = require("../helpers/error");
const _ = require("underscore");
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
    feedback: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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

projectchema.method("getProjectById", async function (_id) {
  let Project = this.model("Project");
  let pro = await Project.findOne({ _id }).populate({
    path: "feedback.userId",
    select: "-pswd", // exclude the password field
  });
  if (!pro) {
    throw new APIError(404, "No project found");
  }
  return pro;
});

projectchema.method("getProjectByDepartment", async function (department) {
  let Project = this.model("Project");
  let pro = await Project.find({ department: department }).populate({
    path: "feedback.userId",
    select: "-pswd", // exclude the password field
  });
  if (!pro) {
    throw new APIError(404, "No project found");
  }
  return pro;
});

projectchema.method("getProjectByYear", async function (year) {
  let Project = this.model("Project");
  let pro = await Project.find({ year: year }).populate({
    path: "feedback.userId",
    select: "-pswd", // exclude the password field
  });
  if (!pro) {
    throw new APIError(404, "No project found");
  }
  return pro;
});

projectchema.method("addUserFeedBack", async function () {
  const course = await this.model("Project").findOne({ _id: this._id });
  if (course == null) {
    throw new APIError(404, "there is no Project with this id exists");
  }

  const user = _.find(course.feedback, (result) => {
    return result.userId.toString() == this.feedback[0].userId;
  });

  if (user != undefined) {
    return await this.model("Project").updateOne(
      {
        _id: this._id,
        feedback: { $elemMatch: { userId: this.feedback[0].userId } },
      },
      { $set: { feedback: this.feedback[0] } },
      { multi: true }
    );
  }

  return await this.model("Project").updateOne(
    { _id: this._id },
    { $push: { feedback: this.feedback } },
    { multi: true }
  );
});

module.exports = mongoose.model("Project", projectchema);
