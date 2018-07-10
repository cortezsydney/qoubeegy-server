
var SqlString = require('sqlstring');

const repoSignIn = function (db) {
    const repo = {
        signIn: ( Username, Password ) => {
            return new Promise((resolve, reject) => {
                const values = [ Username, Password ];
                const queryString = SqlString.format(
                    `CALL userSignIn(?, ?);`, values
                );

                db.query(queryString, (err, results) => {
                    console.log(results)
                    if (err) return reject(500)
                    else if (!results[0].length) return reject(400)
                    return resolve(results)
                });
            });
        }
    }
    return repo;
}

module.exports = repoSignIn;