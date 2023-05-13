const mongoose = require("mongoose");
const validator = require("validator");
const { APIError } = require("../helpers/error");
const _ = require("underscore");
const User = require("./Users");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.smtpEmail,
    pass: process.env.smtpPassword,
  },
});
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
        rating: {
          type: Number,
        },
      },
    ],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewer: [
      {
        firstname: String,
        lastname: String,
        email: String
        },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    singledocument: {
      type: String,
    },
    otherdocument: [String],
  },
  {
    timestamps: true,
  }
);

projectchema.method("ApproveProject", async function (projectId) {
  let Project = this.model("Project");
  let v = await Project.findOneAndUpdate(
    { _id: projectId }, // find the project with the specified ID
    { isApproved: true }, // update the isApproved field to true
    { new: true } // return the updated project document
  );

  console.log(v)
  let user = new User();

  let createdUser = await user.getUser(v.submittedBy);
  // send mail with defined transport object
  let mailOptions = {
    from: process.env.smtpEmail,
    to: createdUser.email,
    subject: `Project " ${v.name} " has been reviwed by Professor`,
    text: `Hello ${createdUser.firstname},
    Congratulations your project has been approved.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return v;
});

projectchema.method("RejectProject", async function (projectId) {
  let Project = this.model("Project");
  let v = await Project.findOneAndUpdate(
    { _id: projectId }, // find the project with the specified ID
    { isApproved: false }, // update the isApproved field to true
    { new: true } // return the updated project document
  );

  let user = new User();
  let createdUser = await user.getUser(v.submittedBy);
  // send mail with defined transport object
  let mailOptions = {
    from: process.env.smtpEmail,
    to: createdUser.email,
    subject: `Project " ${v.name} " has been reviwed by Professor`,
    text: `Hello ${createdUser.firstname},
    We regret to inform you that your project is rejected.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return v;
});

projectchema.method("createProject", async function (project) {
  let Project = this.model("Project");
  if ((await Project.findOne({ name: project.name })) !== null) {
    throw new APIError(400, "Already a same project present with same name.");
  }
  let user = new User();
  let userSent = false;
  
  // Add reviewers from supervisor's team
  let supervisor = {
    email: project.superVisorEmail,
    firstname: project.superVisorFirstname,
    lastname: project.superVisorLastname
  };

  project.reviewer = [];
  project.reviewer.push(supervisor);
  let createdProject;
  let createdUser;
  createdUser = await user.getUser(project.submittedBy);
  project.createdUser = createdUser;
  try {
    createdProject = await Project.create(project);
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new APIError(400, err.message);
    } else {
      throw new APIError(500, "Error creating project: " + err.message);
    }
  }

  if (!userSent) {
    userSent = true;
    // send mail with defined transport object
    let mailOptions = {
      from: process.env.smtpEmail,
      to: createdUser.email,
      subject: `Project ${project.name} created`,
      text: `Hello ${createdUser.firstname}
      Selected reviewers have received an email.
      Wait for the review process to complete, and you will be notified via email as soon as the professor alters the status.
      Thanks & Regards,
      Student Project Portal`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  // send mail with defined transport object
  let mailOptions = {
    from: process.env.smtpEmail,
    to: supervisor.email,
    subject: `A New Project is created by ${createdUser.firstname} ${createdUser.lastname}`,
    text: `Hello Professor,

    A project has been created by ${createdUser.firstname} ${createdUser.lastname} on the Student Project Portal. The title of the project is "${project.name}".
    
    Please follow the link to review the project: You can view it here: http://localhost:3001/detail/${createdProject._id}
    
    Thank you and regards,
    
    Student Project Portal
    `,
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw new APIError(500, "Error sending email: " + error.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return createdProject;
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

projectchema.method("getProjectByDegree", async function (degree) {
  let Project = this.model("Project");
  let pro = await Project.find({ studentStatus: degree }).populate({
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

  // const user = _.find(course.feedback, (result) => {
  //   return result.userId.toString() == this.feedback[0].userId;
  // });

  // if (user != undefined) {
  //   return await this.model("Project").updateOne(
  //     {
  //       _id: this._id,
  //       feedback: { $elemMatch: { userId: this.feedback[0].userId } },
  //     },
  //     { $set: { feedback: this.feedback[0] } },
  //     { multi: true }
  //   );
  // }

  return await this.model("Project").updateOne(
    { _id: this._id },
    { $push: { feedback: this.feedback } },
    { multi: true }
  );
});

projectchema.method("getAllProjectBasedUponReviewer", async function (userid) {
  return await this.model("Project").find({ "reviewer.userId": userid });
});

module.exports = mongoose.model("Project", projectchema);
