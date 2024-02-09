const express = require("express");
const trainsRouter = express.Router();
const { getAllTrains, postTrain } = require("../controllers");

trainsRouter.route("/").post(postTrain);

module.exports = trainsRouter;
