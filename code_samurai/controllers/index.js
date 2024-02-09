const {getAllUsers, postUser} = require("./users")
const {getAllStations, postStation} = require("./stations")
const { getWallet, putWallet } = require("./wallet")
const { getAllTrains, postTrain } = require("./train")
const { getAllTickets, postTicket } = require("./tickets")


module.exports = { getAllUsers, postUser, getAllStations, postStation, getWallet, putWallet, getAllTrains, postTrain, getAllTickets, postTicket }