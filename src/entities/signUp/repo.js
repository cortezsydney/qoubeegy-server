
var SqlString = require('sqlstring');

const signUpRepo = function (db) {
    const repo = {
        checkDuplicate: ({ Username }) => {
            return new Promise((resolve, reject) => {

                const givenUsername = [Username];
                const queryDuplicate = SqlString.format(
                    'SELECT * from USER where Username = ?', givenUsername
                );

                db.query(queryDuplicate, (err, results) => {
                    if (results[0] === undefined) {
                        return resolve(results)
                    } else {
                        return reject(400)
                    }
                });
            })
        },
        signUp: ({ Username, FirstName, LastName, Password }) => {
            return new Promise((resolve, reject) => {
                const addMemberValues = [
                    Username, FirstName, LastName, Password
                ];
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