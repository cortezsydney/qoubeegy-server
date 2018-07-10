
var SqlString = require('sqlstring');
const repoMovie = function (db) {
    const repo = {
        viewMovie: ( Title ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT * from MOVIE where Title LIKE CONCAT('%', ?, '%');`, Title
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    console.log(results)
                    return resolve(results)             
                });
            })
        },
        viewMovies: () => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL viewMovies();`
                );
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                });
            })
        },
        viewMovieHouses : () => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT * from MOVIEHOUSE;`
                );
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                });
            })
        },
        viewHouseByTitle: ( Title ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL viewHouseByTitle(?);`, Title
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)                 
                });
            })
        },
        viewShowingByPlace: ( Place ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL viewShowingByPlace(?);`, Place
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)                  
                });
            })
        },
        viewShowingByPlaceAndTitle: ( Place, Title ) => {
            return new Promise((resolve, reject) => {
                values = [Place, Title];
                const queryString = SqlString.format(
                    `CALL viewShowingByPlaceAndTitle(?, ?);`, values
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0].length) return reject(400)
                    return resolve(results)       
                });
            })
        },
        viewShowingByTitle: ( Title ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL viewShowingByTitle(?);`, Title
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)       
                });
            })
        },
        viewMovieShowingSchedules: () => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL viewMovieShowingSchedules();`
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                    
                });
            })
        },
        viewDistinctMovies : () => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT DISTINCT MOVIE.* from MOVIEHOUSE NATURAL JOIN MOVIESHOWING NATURAL JOIN MOVIE
                    ORDER BY MOVIE.Title ASC;`
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                    
                });
            })
        },
        viewDistinctMoviesByTitle: ( Title ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT DISTINCT MOVIE.* from MOVIEHOUSE NATURAL JOIN MOVIESHOWING NATURAL JOIN MOVIE
                    WHERE MOVIE.Title LIKE CONCAT('%', ?, '%');`, Title
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)       
                });
            })
        }
    }
    return repo;
}

module.exports = repoMovie;