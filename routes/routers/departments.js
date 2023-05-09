const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { processValidationErrors, APIError } = require('../../helpers/error');
const  Department  = require('./../../models/Departments');
const exjwt = require("express-jwt");
const { roles } = require("./../../helpers/constant");
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



// Create a new department
// Create a new department
router.post(
  '/departments',
  ejwtauth,
  body('DepartmentName').trim().isString().notEmpty(),
  body('Color').trim().isString().notEmpty(),
  processValidationErrors,
  async (req, res, next) => {
    try {
      if (req.user.role !== roles.A) {
        throw new APIError(401, 'You are not authorized to create a new department.');
      }

      const department = new Department({ DepartmentName: req.body.DepartmentName, Color: req.body.Color });

      const savedDepartment = await department.save();

      res.status(201).json({ message: 'Department created.', department: savedDepartment });
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

// Get all departments
router.get('/departments/getAll', async (req, res, next) => {
  let department = new Department();
  department.getAlldepartments().then((data) =>{
      res.send(data);
    }).catch(next);
});


// Get a department by ID
router.get(
  '/departments/:DepartmentID',
  param('DepartmentID').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid department ID.'),
  processValidationErrors,
  async (req, res, next) => {
    try {
      const department = await Department.findById(req.params.DepartmentID);

      if (!department) {
        throw new APIError(404, 'Department not found.');
      }

      res.json({ department });
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

// Update a department by ID
router.put(
  '/departments/:DepartmentID',
  ejwtauth,
  param('DepartmentID').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid department ID.'),
  body('DepartmentName').trim().isString().notEmpty(),
  processValidationErrors,
  async (req, res, next) => {
    try {
      if (req.user.role !== roles.A) {
        throw new APIError(401, 'You are not authorized to update a department.');
      }

      const department = await Department.findById(req.params.DepartmentID);

      if (!department) {
        throw new APIError(404, 'Department not found.');
      }

      department.DepartmentName = req.body.DepartmentName;
      const savedDepartment = await department.save();

      res.json({ message: 'Department updated.', department: savedDepartment });
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