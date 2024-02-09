const express = require("express");
const morgan = require("morgan");

const {
  userRouter,
  stationRouter,
  trainRouter,
  walletRouter,
  ticketRouter,
} = require("./routes");
const { db } = require("./db");
//const { db } = require("./db")

const app = express();

//Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.send("fjkashfusfk");
});

app.use("/api/users", userRouter);
app.use("/api/stations", stationRouter);
app.use("/api/trains", trainRouter);
app.use("/api/wallets", walletRouter);
app.use("/api/tickets", ticketRouter);

async function start() {
  try {
    db.run(`
        CREATE TABLE IF NOT EXISTS wallets (
            wallet_id INTEGER PRIMARY KEY,
            balance INTEGER NOT NULL
        )`);
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY  AUTOINCREMENT,
        user_name TEXT NOT NULL,
        balance INTEGER NOT NULL
    )
`);
    db.run(`
    CREATE TABLE IF NOT EXISTS stations (
        station_id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_name TEXT NOT NULL,
        longitude REAL NOT NULL,
        latitude REAL NOT NULL
    )
`);

    db.run(`
    CREATE TABLE IF NOT EXISTS trains (
        train_id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_name TEXT NOT NULL,
        capacity INTEGER NOT NULL
    )
`);
    db.run(`
    CREATE TABLE IF NOT EXISTS stops (
      stop_id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_id INTEGER,
      station_id INTEGER,
      arrival_time TEXT,
      departure_time TEXT,
      fare INTEGER,
      FOREIGN KEY (train_id) REFERENCES trains(train_id),
      FOREIGN KEY (station_id) REFERENCES stations(station_id)
    )
`);
    db.run(`
    CREATE TABLE IF NOT EXISTS stations (
      station_id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_name TEXT NOT NULL,
      longitude FLOAT NOT NULL,
      latitude FLOAT NOT NULL
    )
`);

    app.listen(8000, () => {
      console.log("Server is listening on port 8000.");
    });
  } catch (error) {
    console.log(error);
  }
}

start();
