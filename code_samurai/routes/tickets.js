const express = require("express");
const ticketsRouter = express.Router();
const { getAllTickets, postTicket } = require("../controllers");

ticketsRouter.route("/tickets").get(getAllTickets).post(postTicket);

module.exports = ticketsRouter;
