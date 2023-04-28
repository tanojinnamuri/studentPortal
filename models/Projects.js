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

  let user = new User();
  let createdUser = await user.getUser(v.createdUser);
  // send mail with defined transport object
  let mailOptions = {
    from: process.env.smtpEmail,
    to: us.email,
    subject: `Project ${project.name} created by ${createdUser.firstname} ${createdUser.lastname}`,
    text: `Congratulation your project has been approved`,
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
  let ids = [];
  let user = new User();
  let userSent = false;
  await user
    .getRandomReviewer(project.department)
    .then(async (da) => {
      if (da) {
        for (let us of da) {
          ids.push({ userId: us._id });
          console.log("hello , ", project);
          console.log(project.submittedBy);
          let createdUser = await user.getUser(project.submittedBy);
          if (!userSent) {
            userSent = true;
            // send mail with defined transport object
            let mailOptions = {
              from: process.env.smtpEmail,
              to: createdUser.email,
              subject: `Project ${project.name} created`,
              text: `Emails has been sent to selected reviewers waith for reviewer approval if project approve you will get email`,
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
            to: us.email,
            subject: `Review Project ${project.name} created by ${createdUser.firstname} ${createdUser.lastname}`,
            text: `Kindly review project from portal project the created user email is ${createdUser.email}`,
          };
          console.log("world");
          console.log(mailOptions);
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          // const msg = {
          //   to: us.email, // Change to your recipient
          //   from: process.env.SENDER, // Change to your verified sender
          //   subject: `Review Project ${project.name}`,
          //   text: "Kindly review project from portal",
          // };
          // await sgMail
          //   .send(msg)
          //   .then(() => {
          //     console.log("Email sent");
          //   })
          //   .catch((error) => {
          //     console.error(error);
          //   });
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
