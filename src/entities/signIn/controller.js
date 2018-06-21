const db = require('../../database');
var SqlString = require('sqlstring');
const validator = require('validator');

const controller = {
    signInUser : (req, res) => {
        const Username = req.body.Username;
        const Password = req.body.Password;
        
        if (!Username){
            return res.status(400).json({
                status: 1001, message: 'Email cannot be empty'
            });
        }
        if (!Password){
            return res.status(400).json({
                status: 1004, message: 'Password cannot be empty'
            });
        }

        const values = [Username, Password];
        const queryString = SqlString.format(
            `CALL userSignIn(?, ?);`, values
        );
        
        db.query(queryString, (err, results) =>{
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });  
            }
            if (!results[0].length) {
                return res.status(404).json({ 
                    status: 1015, message: 'Wrong email or password'
                });
            }
            req.session.secret = results[0][0];
            return res.status(200).json({
                status: 200, message: 'Successfully signed in!',
                data: results[0][0]
            });
        }); 
    },
    signOutUser: (req, res) => {
        req.session.destroy();
        res.status(200).json({
            status: 200, message: 'Successfully logs out'
        });
    }
};

module.exports = controller;