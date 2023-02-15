const express = require("express");
const router = express.Router();

const db = require("../db/database.js");

const userRouter = require("./routers/users.js");

router.use([userRouter]);

module.exports = router;
