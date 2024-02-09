const sqlite = require("sqlite3")

module.exports.db = new sqlite.Database("database.db", (err) => {
    if (err) throw err;
  });

