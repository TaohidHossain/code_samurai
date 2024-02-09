const { db } = require("../db");

module.exports.getAllStations = async (req, res) => {
  try {
    const stations = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM stations ORDER BY station_id ASC", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    // Prepare the response model
    const responseModel = {
      stations: stations.map((station) => ({
        station_id: station.station_id,
        station_name: station.station_name,
        longitude: station.longitude,
        latitude: station.latitude,
      })),
    };

    return res.status(200).json(responseModel);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.postStation = async (req, res) => {
  try {
    const { station_name, longitude, latitude } = req.body;

    if (!station_name || !longitude || !latitude) {
      return res.status(400).json({
        error: "Invalid request. Please provide all required fields.",
      });
    }

    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO stations (station_name, longitude, latitude) VALUES (?, ?, ?)",
        [station_name, longitude, latitude],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    // Query the last inserted row to get the correct station_id
    db.get(
      "SELECT * FROM stations WHERE station_id = last_insert_rowid()",
      [],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json({
          station_id: row.station_id,
          station_name,
          longitude,
          latitude,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getAllTrains = async (req, res) => {
  try {
    // Extract station_id from the path parameter
    const { station_id } = req.params;

    // Validate station existence
    const stationExists = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM stations WHERE station_id = ?",
        [station_id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row !== undefined);
          }
        }
      );
    });

    if (!stationExists) {
      return res.status(404).json({
        message: `Station with id: ${station_id} was not found`,
      });
    }

    // Fetch all trains with stops at the given station, sorted by departure time
    const trains = await new Promise((resolve, reject) => {
      db.all(
        `SELECT t.train_id, s.arrival_time, s.departure_time
           FROM trains t
           JOIN stops s ON t.train_id = s.train_id
           WHERE s.station_id = ?
           ORDER BY s.departure_time IS NULL, s.departure_time, s.arrival_time IS NULL, s.arrival_time, t.train_id`,
        [station_id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    // Prepare the response model
    const responseModel = {
      station_id: parseInt(station_id),
      trains: trains.map((train) => ({
        train_id: train.train_id,
        arrival_time: train.arrival_time,
        departure_time: train.departure_time,
      })),
    };

    // Send the successful response
    return res.status(200).json(responseModel);
  } catch (err) {
    console.error(err);
    // In case of an error, return a generic error response
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
