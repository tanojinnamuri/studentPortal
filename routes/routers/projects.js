const exjwt = require("express-jwt");
const express = require("express");
const jwt = require("jsonwebtoken");
const process = require("process");
const Project = require("./../../models/Projects");
const { status, roles } = require("./../../helpers/constant");

const keys = {
  jwtsecret: process.env.jwtsecret,
};

const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

const router = express.Router();

const { processValidationErrors, APIError } = require("../../helpers/error");
const { param, body } = require("express-validator");

router.post("/projects/add", processValidationErrors, (req, res, next) => {
  let project = new Project();
  project
    .createProject(req.body)
    .then((data) => {
      res.sendStatus(data ? 200 : 400);
    })
    .catch(next);
});

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
