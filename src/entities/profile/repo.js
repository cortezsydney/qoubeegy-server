
var SqlString = require('sqlstring');

const repoProfile = function (db) {
    const repo = {
        checkPassword: ( OldPassword, UserId ) => {
            return new Promise((resolve, reject) => {
                checkValues = [OldPassword, UserId];
                const queryAuthenticate = SqlString.format(
                    `SELECT * from USER where Password = sha2(?,256) and UserId = ?;`, checkValues
                );

                db.query(queryAuthenticate, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                });
            })
        },
        editUser: ( UserId, FirstName, LastName, NewPassword ) => {
            return new Promise((resolve, reject) => {
                const editUserValues = [ UserId, FirstName, LastName, NewPassword ];
                const queryString = SqlString.format(
                    `CALL editUser(?, ?, ?, ?);`, editUserValues
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            });
        },
        checkExistingRequest: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryAuthenticate = SqlString.format(
                    `SELECT * from REQUEST where UserId = ?;`, UserId
                );

                db.query(queryAuthenticate, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return resolve(results)
                    return reject(400)
                });
            })
        },
        checkExistingRequestTwo: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryAuthenticate = SqlString.format(
                    `SELECT * from REQUEST where UserId = ?;`, UserId
                );

                db.query(queryAuthenticate, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                });
            })
        },
        checkExistingMovieId: ( MovieId ) => {
            return new Promise((resolve, reject) => {
                const queryAuthenticate = SqlString.format(
                    `SELECT * from MOVIE where MovieId = ?;`, MovieId
                );

                db.query(queryAuthenticate, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                });
            })
        },
        checkExistingFavoriteId: ( FavoriteId ) => {
            return new Promise((resolve, reject) => {
                const queryAuthenticate = SqlString.format(
                    `SELECT * from FAVORITE where FavoriteId = ?;`, FavoriteId
                );

                db.query(queryAuthenticate, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return reject(400)
                    return resolve(results)
                });
            })
        },
        sendRequest: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL addRequest(?);`, UserId
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            })
        },
        approveRequest: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL addAdmin(?)`, UserId
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            })
        },
        rejectRequest: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `DELETE from REQUEST where UserId = ?;`, UserId
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            })
        },
        addFavorite: ( MovieId, UserId ) => {
            return new Promise((resolve, reject) => {
                Request = [MovieId, UserId];
                const queryString = SqlString.format(
                    `CALL addFavorite(?, ?);`, Request
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            })
        },
        deleteFavorite: ( FavoriteId ) => {
            return new Promise((resolve, reject) => {
                Favorite = [FavoriteId];
                const queryString = SqlString.format(
                    `CALL deleteFavorite(?);`, Favorite
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            })
        },
        viewFavorite: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT FAVORITE.*, MOVIE.* from FAVORITE NATURAL JOIN MOVIE where FAVORITE.UserId = ?
                    ORDER BY MOVIE.Title;`, UserId
                );

                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            })
        }
    }
    return repo;
}

module.exports = repoProfile;