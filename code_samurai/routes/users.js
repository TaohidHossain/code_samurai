const express = require("express");
const userRouter = express.Router();
const { getAllUsers, postUser } = require("../controllers");

userRouter.route("/").get(getAllUsers).post(postUser);

module.exports = userRouter;
