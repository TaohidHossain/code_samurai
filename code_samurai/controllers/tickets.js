const { db } = require("../db");

module.exports.getAllTickets = async (req, res) => {
  try {
    return res.status(200).send({ tickets: "rows" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.postTicket = async (req, res) => {
  const { body } = req;
  try {
    res.status(201).send(body);
  } catch (err) {
    console.log(err);
  }
};
