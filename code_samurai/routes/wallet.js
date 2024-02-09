const express = require("express")
const walletsRouter = express.Router()
const { getWallet, putWallet } = require("../controllers")


walletsRouter.route("/:id").get(getWallet).put(putWallet)


module.exports = walletsRouter