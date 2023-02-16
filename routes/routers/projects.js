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

module.exports = router;
