
var SqlString = require('sqlstring');

const repoAdminBooking = function (db) {
    const repo = {
        checkExistingMovieBookingId: ( MovieBookingId ) => {
            return new Promise((resolve, reject) => {
                const queryAuthenticate = SqlString.format(
                    `SELECT * from MOVIEBOOKING where MovieBookingId = ?;`, MovieBookingId
                );

                db.query(queryAuthenticate, (err, results) => {
                    if (!results[0]) return reject(400)
                    else return resolve(results) 
                });
            })
        },
        deleteBooking: ( MovieBookingId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `DELETE from MOVIEBOOKING where MovieBookingId = ?;`, MovieBookingId
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            });
        },
        viewMovieBookings: () => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL viewMovieBookings();`
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0].length) return reject(400)
                    return resolve(results)       
                });
            });
        },
        viewEachBooking: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL viewBookingById(?);`, UserId
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0].length) return reject(400)
                    return resolve(results)       
                });
            });
        }       
    }
    return repo;
}

module.exports = repoAdminBooking;