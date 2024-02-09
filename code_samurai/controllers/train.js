const { db } = require("../db");

module.exports.getAllTrains = async (req, res) => {
  try {
    // Extract station_id from the path parameter
    const { station_id } = req.params;
    console.log("id", station_id);
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
      // If the station does not exist, return a 404 response
      return res.status(404).json({
        message: `Station with id: ${station_id} was not found`,
      });
    }

    // Fetch the list of trains for the given station, sorted as per the specifications
    const trains = await new Promise((resolve, reject) => {
      db.all(
        `SELECT t.train_id, s.arrival_time, s.departure_time
             FROM stops s
             JOIN trains t ON s.train_id = t.train_id
             WHERE s.station_id = ?
             ORDER BY s.departure_time ASC, s.arrival_time ASC, t.train_id ASC`,
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

const isValidTimeFormat = (time) => {
  if (time === null) {
    return true;
  }
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
};
module.exports.postTrain = async (req, res) => {
  try {
    const { train_name, capacity, stops } = req.body;

    if (!train_name || !capacity || !stops || stops.length === 0) {
      return res.status(400).json({
        error: "Invalid request. Please provide all required fields.",
      });
    }

    if (
      stops[0].arrival_time !== null ||
      stops[stops.length - 1].departure_time !== null ||
      stops[0].fare !== 0
    ) {
      return res.status(400).json({
        error:
          "Invalid stops data. Check first station arrival time, last station departure time, and zero fare for the first station.",
      });
    }

    const result = await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO trains (train_name, capacity) VALUES (?, ?)",
        [train_name, capacity],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });

    const train_id = result;

    for (const stop of stops) {
      if (
        !isValidTimeFormat(stop.arrival_time) ||
        !isValidTimeFormat(stop.departure_time)
      ) {
        return res.status(400).json({
          error: "Invalid time format.",
        });
      }

      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO stops (train_id, station_id, arrival_time, departure_time, fare) VALUES (?, ?, ?, ?, ?)",
          [
            train_id,
            stop.station_id,
            stop.arrival_time,
            stop.departure_time,
            stop.fare,
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }

    const serviceInfo = await new Promise((resolve, reject) => {
      db.get(
        `SELECT
             MIN(departure_time) AS service_start,
             MAX(arrival_time) AS service_ends,
             COUNT(DISTINCT station_id) AS num_stations
           FROM stops
           WHERE train_id = ?`,
        [train_id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    return res.status(201).json({
      train_id,
      train_name,
      capacity,
      service_start: serviceInfo.service_start || stops[0].departure_time,
      service_ends:
        serviceInfo.service_ends || stops[stops.length - 1].arrival_time,
      num_stations: serviceInfo.num_stations,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
