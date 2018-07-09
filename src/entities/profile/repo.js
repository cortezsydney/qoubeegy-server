
var SqlString = require('sqlstring');

const repoProfile = function (db) {
    const repo = {
        checkPassword: ({ OldPassword, UserId }) => {
            return new Promise((resolve, reject) => {
                checkValues = [OldPassword, UserId];
                const queryAuthenticate = SqlString.format(
                    `SELECT * from USER where Password = sha2(?,256) and UserId = ?`, checkValues
                );

                db.query(queryAuthenticate, (err, results) => {
                    if (!results[0]) {
                        return reject(400)
                    } else {
                        return resolve(results)
                    }
                });
            })
        },
        editUser: ({ UserId, FirstName, LastName, NewPassword }) => {
            return new Promise((resolve, reject) => {
                const editUserValues = [
                    UserId, FirstName, LastName, NewPassword
                ];
                const queryString = SqlString.format(
                    `CALL editUser(?, ?, ?, ?);`, editUserValues
                );
                
                db.query(queryString, (err, results) => {
                    if (err) return reject(500)
                    return resolve(results)
                });
            });
        },
        deleteUser: ({ UserId }) => {
            return new Promise((resolve, reject) => {
                const givenUserId = [UserId];
                const queryString = SqlString.format(
                    `CALL deleteUser(?);`, givenUserId
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

module.exports = repoProfile;