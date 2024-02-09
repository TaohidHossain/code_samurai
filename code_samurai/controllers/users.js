const { db } = require("../db");

module.exports.getAllUsers = async (req, res) => {
  try {
    return res.status(200).send({ users: "asnfjksajfs" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.postUser = async (req, res) => {
  try {
    const { user_name, balance } = req.body;

    if (!user_name || !balance) {
      return res.status(400).json({
        error: "Invalid request. Please provide all required fields.",
      });
    }

    let user_id;

    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (user_name, balance) VALUES (?, ?)",
        [user_name, balance],
        function (err) {
          if (err) {
            reject(err);
          } else {
            user_id = this.lastID;
            resolve();
          }
        }
      );
    });

    return res.status(201).json({
      user_id,
      user_name,
      balance,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
