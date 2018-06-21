const db = require('../../database');
var SqlString = require('sqlstring');
const validator = require('validator');

const controller = {
    editUser : (req, res) => {
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'UserId cannot be empty, you are not signed in'
            });
        }
        
        const UserId = req.session.secret.UserId;
        const FirstName = req.body.FirstName;
        const LastName = req.body.LastName;
        const NewPassword = req.body.NewPassword;
        const OldPassword = req.body.OldPassword;

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
        if (!OldPassword){
            return res.status(400).json({
                status: 1006, message: 'Old Password cannot be empty'
            });
        }
        if (!NewPassword){
            return res.status(400).json({
                status: 1004, message: 'Password cannot be empty'
            });
        }
        if (NewPassword.length < 4 || NewPassword.length > 16){
            return res.status(400).json({
                status: 1011, message: 'Invalid password, password must be 4 - 16 characters long'
            });
        }
        if (!validator.isAlphanumeric(NewPassword)){
            return res.status(400).json({
                status: 1012, message: 'Invalid password, must only contain alphanumeric characters'
            });
        }

        givenPassword = [OldPassword, UserId];
        const queryAuthenticate = SqlString.format(
            `SELECT UserId from USER where Password = sha2(?,256) and UserId = ?`, givenPassword
        );
        
        db.query(queryAuthenticate, (err, results) => {
            if(!results[0]){
                return res.status(404).json({
                    status: 1016, message: 'Password does not match'
                }); 
            }else{
                const editUservalues = [
                    UserId, FirstName, LastName, NewPassword
                ];
                const queryString = SqlString.format(
                    `CALL editUser(?, ?, ?, ?);`, editUservalues
                );
                
                db.query(queryString, (err, results) => {
                    if (err)
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    else{
                        return res.status(200).json({
                            status: 200, message: 'Successfully edited user!'
                        });
                    }
                });
            }
        });
    },
    deleteUser:  (req, res)=> {
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }
        
        const givenUserId = [req.session.secret.UserId];
        const queryString = SqlString.format(
            `DELETE from USER where UserId = ?;`, givenUserId
        );

        db.query(queryString, (err, result) => {
            if(err){ 
                console.log(err.message);
                return res.status(500).json({ status: 500, message: 'Internal server error' });
            }else{
                req.session.destroy();
                return res.status(200).json({
                    status: 200, message: 'Successfully deleted your profile! You are automatically logged out.'
                });
            }
        });
                       
    },
    sendRequest: (req, res) =>{
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in'
            });
        }

        if (req.session.secret.UserType === "ADMIN"){
            return res.status(400).json({
                status: 1036, message: 'Already an admin!'
            });
        }
        
        const givenUserId = [req.session.secret.UserId];
        const queryDuplicate = SqlString.format(
            `SELECT UserId FROM REQUEST WHERE UserId = ?`, givenUserId
        )

        db.query(queryDuplicate, (err, results) =>{
            if(!results[0]){
                const queryString = SqlString.format(
                    `CALL addRequest(?);`, givenUserId
                );
                
                db.query(queryString, (err, results) => {
                    if (err)
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    else{
                        return res.status(200).json({
                            status: 200, message: 'Successfully sent admin request!'
                        });
                    }
                });
            }else{
                return res.status(400).json({
                    status: 1022, message: 'Admin Request is existing!'
                });
            }
        });
    },
    approveRequest: (req, res) => {
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }
        if (!req.session.secret.UserId){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }if (!req.body.UserId){
            return res.status(400).json({
                status: 1023, message: 'Request cannot be empty!'
            });
        }
        if (req.session.secret.UserType === "MEMBER" ){
            return res.status(400).json({
                status: 1034, message: 'You are not an admin!'
            });
        }
        
        const givenUserId = [req.body.UserId];
        const querySearch = SqlString.format(
            `SELECT * from REQUEST where UserId = ?`, givenUserId
        );

        db.query(querySearch, (err, result) => {
            if(!result[0]){ 
                return res.status(400).json({
                    status: 1037, message: 'Request not found!'
                });
            }else{
                const queryString = SqlString.format(
                    `CALL addAdmin(?);`, givenUserId
                );

                db.query(queryString, (err, Result) => {
                    if(err){ 
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    }
                    else{
                        return res.status(200).json({
                            status: 200, message: 'Successfully approved request!'
                        });
                    }
                });
            }
        });          
    },
    rejectRequest: (req, res)=> {
        const UserId = req.body.UserId;
        
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }

        const AdminId = req.session.secret.UserId;

        if (!UserId){
            return res.status(400).json({
                status: 1023, message: 'No request!'
            });
        }
        if (req.session.secret.UserType === "MEMBER" ){
            return res.status(400).json({
                status: 1034, message: 'You are not an admin!'
            });
        }
        const givenUserId = [req.body.UserId];
        const querySearch = SqlString.format(
            `SELECT * from REQUEST where UserId = ?`, givenUserId
        );

        db.query(querySearch, (err, result) => {
            if(!result[0]){ 
                return res.status(400).json({
                    status: 1037, message: 'Request not found!'
                });
            }else{
                const givenUserId = [UserId];
                const queryString = SqlString.format(
                    `DELETE from REQUEST where UserId = ?;`, givenUserId
                );

                db.query(queryString, (err, Result) => {
                    if(err){ 
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    }else{
                        return res.status(200).json({
                            status: 200, message: 'Successfully rejected request!'
                        });
                    }
                });
            }
        });             
    }
};

module.exports = controller;