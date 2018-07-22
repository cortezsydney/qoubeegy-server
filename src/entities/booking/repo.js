var SqlString = require("sqlstring");

const repoBooking = function(db) {
  const repo = {
    getSeats: MovieShowingId => {
      return new Promise((resolve, reject) => {
        const queryAuthenticate = SqlString.format(
          `SELECT Seat from MOVIEBOOKING where MovieShowingId = ?;`,
          MovieShowingId
        );

        db.query(queryAuthenticate, (err, results) => {
          if (results[0]) return resolve(results);
          else return reject(400);
        });
      });
    },
    checkExistingSeat: (MovieShowingId, Seat) => {
      return new Promise((resolve, reject) => {
        values = [MovieShowingId, Seat];
        const queryAuthenticate = SqlString.format(
          `SELECT * from MOVIEBOOKING where MovieShowingId = ? and Seat = ?;`,
          values
        );

        db.query(queryAuthenticate, (err, results) => {
          if (!results[0]) return resolve(results);
          else return reject(400);
        });
      });
    },
    checkExistingBookingId: (UserId, MovieBookingId) => {
      return new Promise((resolve, reject) => {
        values = [UserId, MovieBookingId];
        const queryAuthenticate = SqlString.format(
          `SELECT * FROM MOVIEBOOKING where UserId = ? and MovieBookingId = ?;`,
          values
        );

        db.query(queryAuthenticate, (err, results) => {
          if (!results[0]) return reject(400);
          else return resolve(results);
        });
      });
    },
    addBooking: (MovieShowingId, UserId, Seat) => {
      return new Promise((resolve, reject) => {
        const values = [MovieShowingId, UserId, Seat];
        const queryString = SqlString.format(
          `CALL addMovieBooking(?, ?, ?);`,
          values
        );

        db.query(queryString, (err, results) => {
          if (err) return reject(500);
          return resolve(results);
        });
      });
    },
    deleteBooking: (UserId, MovieBookingId) => {
      return new Promise((resolve, reject) => {
        const values = [UserId, MovieBookingId];
        const queryString = SqlString.format(
          `DELETE from MOVIEBOOKING where UserId = ? and MovieBookingId = ?;`,
          values
        );

        db.query(queryString, (err, results) => {
          if (err) return reject(500);
          return resolve(results);
        });
      });
    },
    viewBooking: UserId => {
      return new Promise((resolve, reject) => {
        const queryString = SqlString.format(
          `CALL viewBookingById(?);`,
          UserId
        );

        db.query(queryString, (err, results) => {
          if (err) return reject(500);
          if (!results[0].length) return reject(400);
          return resolve(results);
        });
      });
    }
  };
  return repo;
};

module.exports = repoBooking;
