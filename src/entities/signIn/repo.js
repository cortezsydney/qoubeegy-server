
var SqlString = require('sqlstring');

const repoSignIn = function (db) {
    const repo = {
        signIn: ({ Username, Password }) => {
            return new Promise((resolve, reject) => {
                const signInValues = [
                    Username, Password
                ];
                const queryString = SqlString.format(
                    `CALL userSignIn(?, ?);`, signInValues
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

module.exports = repoSignIn;