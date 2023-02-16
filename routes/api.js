const express = require("express");
const router = express.Router();

const db = require("../db/database.js");

const userRouter = require("./routers/users.js");
const projectRouter = require("./routers/projects.js");

router.use([userRouter, projectRouter]);

module.exports = router;
