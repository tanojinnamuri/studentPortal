const exjwt = require("express-jwt");
const express = require("express");
const jwt = require("jsonwebtoken");
const process = require("process");
const User = require("./../../models/Users");
const { status, roles } = require("./../../helpers/constant");

const keys = {
  jwtsecret: process.env.jwtsecret,
};

const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

const router = express.Router();
const validateObjectID = require("mongoose").Types.ObjectId.isValid;
const { processValidationErrors, APIError } = require("../../helpers/error");
const { param, body } = require("express-validator");
const { input, data } = require("../../helpers/logger");

/*
  --------
  Create
  --------
*/

router.post(
  "/users/register",
  body("firstname").escape(),
  body("lastname").escape(),
  body(
    "username",
    "Username is required and only alpha numeric characters are allowed"
  ).isAlphanumeric(),
  body("email", "Email is required").isEmail().normalizeEmail(),
  body(
    "pswd",
    "Password is required, must contain atleast 6 characters, and must be a string."
  )
    .isLength({ min: 6 })
    .isString(),

  (req, res, next) => {
    let user = new User();
    user
      .createUser(req.body)
      .then((data) => {
        res.send({ message: "User registered" });
      })
      .catch(next);
  }
);

/*
  --------
  Read
  --------
*/

router.post(
  "/users/login",
  body("email", "Email is required and must be a valid mail")
    .isEmail()
    .normalizeEmail(),

  processValidationErrors,
  (req, res, next) => {
    let user = new User();
    user
      .checkIfUserWithEmailExists(req.body.email)
      .then((_user) => {
        // verify password
        if (user.checkPass(_user, req.body.pswd)) {
          let token = jwt.sign(
            {
              _id: _user._id,
              username: _user.username,
              role: _user.role,
            },
            keys.jwtsecret
          );
          if (_user.status === status.B) {
            next(
              new APIError(
                400,
                "you are blocked by admin request him to unblock you."
              )
            );
          } else {
            if (_user.role == roles.S) {
              // TODO: never expiring tokens
              res.send({
                _id: _user._id,
                token,
                student: true,
                viewer: false,
                reviewer: false,
                message: "Keep it safe :)",
              });
            } else if (_user.role == roles.R) {
              res.send({
                _id: _user._id,
                token,
                student: false,
                viewer: false,
                reviewer: true,
                message: "Keep it safe :)",
              });
            } else if (_user.role == roles.V) {
              res.send({
                _id: _user._id,
                token,
                student: false,
                viewer: true,
                reviewer: false,
                message: "Keep it safe :)",
              });
            }
          }
        } else {
          next(new APIError(400, "Invalid Email or Password"));
        }
      })
      .catch(next);
  }
);

router.put(
  "/users/updatePassword/",
  ejwtauth,
  processValidationErrors,
  (req, res, next) => {
    const user = new User({ _id: req.body._id, pswd: req.body.pswd });
    user
      .updatePassword(req.body.oldpassword)
      .then((data) => {
        res.sendStatus(data ? 200 : 400);
      })
      .catch(next);
  }
);

module.exports = router;
