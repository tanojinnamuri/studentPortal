const mongoose = require("mongoose");
const validator = require("validator");
const { APIError } = require("../helpers/error");
const _ = require("underscore");
const User = require("./Users");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const projectchema = mongoose.Schema(
  {
    name: String,
    abstract: String,
    presenterFirstName: String,
    presenterLastName: String,
    homeTown: String,
    studentStatus: String,
    studentIdNumber: String,
    studentEmail: String,
    presenter: String,
    presentationFormat: String,
    presentationArea: String,
    superVisorFirstname: String,
    superVisorLastname: String,
    superVisorEmail: String,
    presenterSignatureFirstname: String,
    presenterSignatureLastname: String,
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
    reviewer: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
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
  let ids = [];
  let user = new User();
  await user
    .getRandomReviewer(project.department)
    .then(async (da) => {
      if (da) {
        for (let us of da) {
          ids.push({ userId: us._id });

          console.log(us);

          const msg = {
            to: us.email, // Change to your recipient
            from: process.env.SENDER, // Change to your verified sender
            subject: `Review Project ${project.name}`,
            text: "Kindly review project from portal",
          };
          await sgMail
            .send(msg)
            .then(() => {
              console.log("Email sent");
            })
            .catch((error) => {
              console.error(error);
            });
        }
        // da.forEach(async (element) => {
        //   ids.push({ userId: element._id });

        //   console.log(ids);

        //   const msg = {
        //     to: element.email, // Change to your recipient
        //     from: process.env.SENDER, // Change to your verified sender
        //     subject: `Review Project ${project.name}`,
        //     text: "Kindly review project from portal",
        //   };
        //   await sgMail
        //     .send(msg)
        //     .then(() => {
        //       console.log("Email sent");
        //     })
        //     .catch((error) => {
        //       console.error(error);
        //     });
        // });
      }
    })
    .catch((erro) => {
      console.log(erro);
    });

  project.reviewer = ids;

  console.log(ids);

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
