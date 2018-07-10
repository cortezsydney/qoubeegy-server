
var SqlString = require('sqlstring');

const repoAdminUser = function (db) {
    const repo = {
        viewUsers: () => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT * from USER;`
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)       
                });
            });
        },
        viewRequest: () => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT USER.*, REQUEST.TimeDate FROM USER NATURAL JOIN REQUEST;`
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)       
                });
            });
        },
        deleteUser: ( UserId ) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `CALL deleteUser(?);`, UserId
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            });
        },
        viewEachFavorite: (UserId) => {
            return new Promise((resolve, reject) => {
                const queryString = SqlString.format(
                    `SELECT FAVORITE.*, MOVIE.* from FAVORITE NATURAL JOIN MOVIE where FAVORITE.UserId = ?;`, UserId
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)       
                });
            });
        },
        
    }
    return repo;
}

module.exports = repoAdminUser;