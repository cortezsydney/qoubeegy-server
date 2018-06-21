const db = require('../../database');
var SqlString = require('sqlstring');
const validator = require('validator')

const controller = {
    addMember : (req, res, next) => {
        const Username = req.body.Username;
        const FirstName = req.body.FirstName;
        const LastName = req.body.LastName;
        const Password = req.body.Password;
        
        if (!Username){
            return res.status(400).json({
                status: 1001, message: 'Email cannot be empty'
            });
        }
        if (!FirstName){
            return res.status(400).json({
                status: 1002, message: 'First Name cannot be empty'
            });
        }
        if (!LastName){
            return res.status(400).json({
                status: 1003, message: 'Last Name cannot be empty'
            });
        }
        if (!Password){
            return res.status(400).json({
                status: 1004, message: 'Password cannot be empty'
            });
        }
        if (Password.length < 4 || Password.length > 16){
            return res.status(400).json({
                status: 1011, message: 'Invalid password, password must be 4 - 16 characters long'
            });
        }
        if (!validator.isEmail(Username)){
            return res.status(400).json({
                status: 1013, message: 'Invalid email'
            });
        }
        if (!validator.isAlphanumeric(Password)){
            return res.status(400).json({
                status: 1012, message: 'Invalid password, must only contain alphanumeric characters'
            });
        }

        const givenUsername = [Username];
        const queryDuplicate = SqlString.format(
            'SELECT * from USER where Username = ?', givenUsername
        );

        db.query(queryDuplicate, (err, results) =>{
            if(results[0] === undefined){
                const addMemberValues = [
                    Username, FirstName, LastName, Password
                ];
                const queryString = SqlString.format(
                    `CALL addUser(?, ?, ?, ?, "MEMBER");`, addMemberValues
                );
                
                db.query(queryString, (err, results) => {
                    if (err) {
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    }return res.status(200).json({
                        status: 200, message: 'Successfully added user!'
                    });
                });
            }else{
                return res.status(400).json({
                    status: 1021, message: 'Email is existing'
                });
            }
        });
    }
};

module.exports = controller;