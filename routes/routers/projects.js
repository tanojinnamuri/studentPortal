const exjwt = require("express-jwt");
const express = require("express");
const jwt = require("jsonwebtoken");
const process = require("process");
const Project = require("./../../models/Projects");
const { status, roles } = require("./../../helpers/constant");
const multer = require("multer");
const mime = require("mime-types");
const fs = require("fs");
const keys = {
  jwtsecret: process.env.jwtsecret,
};
// Load the AWS SDK
const AWS = require("aws-sdk");
const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });
const multerS3 = require("multer-s3");
// Configure your AWS credentials
AWS.config.update({
  accessKeyId: process.env.Accesskey,
  secretAccessKey: process.env.AccessPassword,
});

// Create an S3 object
const s3 = new AWS.S3({
  params: {
    Bucket: "masterprojectbucketnew",
  },
});

const router = express.Router();

const { processValidationErrors, APIError } = require("../../helpers/error");
const { param, body } = require("express-validator");

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["video/mp4", "video/webm", "video/quicktime"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const upload = multer({
  // https://github.com/expressjs/multer
  fileFilter,
  dest: "./public/uploads/",

  rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, "-").toLowerCase();
  },
});

// Create an instance of multer middleware to handle the file upload
// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: (req, file, cb) => {
//     const allowedMimes = ["video/mp4", "video/webm", "video/quicktime"];
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Invalid file type"));
//     }
//   },
// });

router.post(
  "/projects/add",
  upload.single("video"),
  processValidationErrors,
  (req, res, next) => {
    const { originalname, filename } = req.file;
    let p = req.body;
    var params = {
      ACL: "public-read",
      Bucket: "masterprojectbucketnew",
      Body: fs.createReadStream(req.file.path),
      Key: `uploads/${req.file.originalname}`,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error occured while trying to upload to S3 bucket", err);
        res.send(400);
      }

      if (data) {
        fs.unlinkSync(req.file.path); // Empty temp folder
        const locationUrl = data.Location;
        p.demoVideo = locationUrl;
        let project = new Project();
        project
          .createProject(p)
          .then((data) => {
            res.sendStatus(data ? 200 : 400);
          })
          .catch(next);
      }
    });
  }
);

router.get("/projects/getAll", processValidationErrors, (req, res, next) => {
  let project = new Project();
  project
    .getAllProjects()
    .then((data) => {
      res.send(data);
    })
    .catch(next);
});

router.get(
  "/projects/getAllReviverProjects/:id",
  processValidationErrors,
  (req, res, next) => {
    let project = new Project();
    project
      .getAllProjectBasedUponReviewer(req.params.id)
      .then((data) => {
        res.send(data);
      })
      .catch(next);
  }
);

router.get(
  "/projects/getProject/:id",
  processValidationErrors,
  (req, res, next) => {
    const project = new Project();
    project
      .getProjectById(req.params.id)
      .then((data) => {
        if (data.length == 0) {
          throw new APIError(404, "There is no project with this id");
        }
        res.send(data);
      })
      .catch(next);
  }
);

router.get(
  "/projects/ApproveProject/:id",
  processValidationErrors,
  (req, res, next) => {
    const project = new Project();
    project
      .ApproveProject(req.params.id)
      .then((data) => {
        res.send(data);
      })
      .catch(next);
  }
);

router.get(
  "/projects/getProject/:type/:query",
  processValidationErrors,
  (req, res, next) => {
    const project = new Project();

    if (req.params.type == "department") {
      project
        .getProjectByDepartment(req.params.query)
        .then((data) => {
          if (data.length == 0) {
            throw new APIError(404, "There is no project with this query");
          }
          res.send(data);
        })
        .catch(next);
    } else {
      project
        .getProjectByYear(req.params.query)
        .then((data) => {
          if (data.length == 0) {
            throw new APIError(404, "There is no project with this query");
          }
          res.send(data);
        })
        .catch(next);
    }
  }
);

router.post(
  "/projects/addFeedback",
  // ejwtauth,
  processValidationErrors,
  (req, res, next) => {
    const project = new Project({
      _id: req.body.projectId,
      feedback: {
        userId: req.body.user_id,
        comment: req.body.comment,
        rating: req.body.rating,
      },
    });

    project
      .addUserFeedBack()
      .then((data) => {
        res.sendStatus(data ? 200 : 400);
      })
      .catch(next);
  }
);

module.exports = router;
