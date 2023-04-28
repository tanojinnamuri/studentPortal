const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { processValidationErrors, APIError } = require('../../helpers/error');
const  Degree  = require('../../models/Degrees');
const exjwt = require("express-jwt");
const { roles } = require("../../helpers/constant");
const jwt = require("jsonwebtoken");
const process = require("process");
const mongoose = require('mongoose');


const keys = {
  jwtsecret: process.env.jwtsecret,
};

const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

/*
  --------
  Create
  --------
*/



// Create a new degree
router.post(
  '/degrees',
  ejwtauth,
  body('DegreeName').trim().isString().notEmpty(),
  processValidationErrors,
  async (req, res, next) => {
    try {
      if (req.user.role !== roles.A) {
        throw new APIError(401, 'You are not authorized to create a new degree.');
      }

      const degree = new Degree({ DegreeName: req.body.DegreeName });

      const savedDegree = await degree.save();

      res.status(201).json({ message: 'Degree created.', degree: savedDegree });
    } catch (error) {
      next(error);
    }
  }
);

/*
  --------
  Read
  --------
*/

// Get all degrees
router.get('/degrees/getAll', async (req, res, next) => {
  let degree = new Degree();
  degree.getAlldegrees().then((data) =>{
      res.send(data);
    }).catch(next);
});


// Get a degree by ID
router.get(
  '/degrees/:DegreeID',
  param('DegreeID').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid degree ID.'),
  processValidationErrors,
  async (req, res, next) => {
    try {
      const degree = await Degree.findById(req.params.DegreeID);

      if (!degree) {
        throw new APIError(404, 'Degree not found.');
      }

      res.json({ degree });
    } catch (error) {
      next(error);
    }
  }
);

/*
  --------
  Update
  --------
*/

// Update a degree by ID
router.put(
  '/degrees/:DegreeID',
  ejwtauth,
  param('DegreeID').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid degree ID.'),
  body('DegreeName').trim().isString().notEmpty(),
  processValidationErrors,
  async (req, res, next) => {
    try {
      if (req.user.role !== roles.A) {
        throw new APIError(401, 'You are not authorized to update a degree.');
      }

      const degree = await Degree.findById(req.params.DegreeID);

      if (!degree) {
        throw new APIError(404, 'Degree not found.');
      }

      degree.DegreeName = req.body.DegreeName;
      const savedDegree = await degree.save();

      res.json({ message: 'Degree updated.', degree: savedDegree });
    } catch (error) {
      next(error);
    }
  }
);

/*
  --------
  Deletez
  --------
*/

module.exports = router;