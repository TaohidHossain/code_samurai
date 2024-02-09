const express = require("express");
const stationsRouter = express.Router();
const { getAllStations, postStation, getAllTrains } = require("../controllers");

stationsRouter.route("/").get(getAllStations).post(postStation);
stationsRouter.route("/:station_id/trains").get(getAllTrains);

module.exports = stationsRouter;
