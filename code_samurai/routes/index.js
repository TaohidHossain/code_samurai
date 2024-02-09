const userRouter = require("./users")
const stationRouter = require("./stations")
const trainRouter = require("./trains")
const walletRouter = require("./wallet")
const ticketRouter = require("./tickets")
//const { getAll, getOne, postOne, patchOne, deleteOne } = require("../controllers")


//router.route("/").get(getAll).post(postOne)
//router.route("/:id").get(getOne).patch(patchOne).delete(deleteOne)




module.exports = { userRouter, stationRouter, trainRouter, walletRouter, ticketRouter }