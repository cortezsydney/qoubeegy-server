
var SqlString = require('sqlstring');

const repoAdminMovie = function (db) {
    const repo = {
        addMovie: ( Title, Description, Place, Price, Date, Time, Photo, Details ) => {
            return new Promise((resolve, reject) => {
                const values = [Title, Description, Place, Price, Date, Time, Photo, Details];
                const queryString = SqlString.format(
                    `CALL addMovie(?, ?, ?, ?, ?, ?, ?, ?)`, values
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)       
                });
            });
        },
        deleteShowing: ( MovieShowingId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL deleteShowing(?)`, MovieShowingId
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            });
        },
        addShowing: ( MovieId, MovieHouseId, Date, Time ) => {
            return new Promise((resolve, reject) => {
                const values = [MovieId, MovieHouseId, Date, Time];
                const queryString = SqlString.format(
                    `CALL addMovieShowing(?, ?, ?, ?)`, values
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)       
                });
            });
        }     
    }
    return repo;
}

module.exports = repoAdminMovie;