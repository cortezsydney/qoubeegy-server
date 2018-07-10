
var SqlString = require('sqlstring');

const signUpRepo = function (db) {
    const repo = {
        checkDuplicate: ( Username ) => {
            return new Promise((resolve, reject) => {
                const queryDuplicate = SqlString.format(
                    'SELECT * from USER where Username = ?', Username
                );

                db.query(queryDuplicate, (err, results) => {
                    if (err) return reject(500)
                    if (!results[0]) return resolve(results)
                    return reject(400)
                });
            })
        },
        signUp: (Username, FirstName, LastName, Password) => {
            return new Promise((resolve, reject) => {
                const addMemberValues = [ Username, FirstName, LastName, Password ];
                const queryString = SqlString.format(
                    `CALL addUser(?, ?, ?, ?, "MEMBER");`, addMemberValues
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

module.exports = signUpRepo;