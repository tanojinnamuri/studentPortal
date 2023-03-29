const express = require("express");
const router = express.Router();

const db = require("../db/database.js");

const userRouter = require("./routers/users.js");
const projectRouter = require("./routers/projects.js");
const departmentRouter = require("./routers/departments.js");

router.use([userRouter, projectRouter,departmentRouter]);

module.exports = router;
