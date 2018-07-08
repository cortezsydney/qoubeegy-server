const db = require('../../../database');
var SqlString = require('sqlstring');

const controller = {
    deleteBooking: (req, res)=> {
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }

        if (req.session.secret.UserType === "MEMBER" ){
            return res.status(400).json({
                status: 1034, message: 'You are not an admin!'
            });
        }

        const values = [req.params.MovieBookingId];
        
        if (!req.params.MovieBookingId){
            return res.status(400).json({
                status: 1007, message: 'MovieBookingId cannot be empty!'
            });
        }

        const queryString = SqlString.format(
            `DELETE from MOVIEBOOKING where MovieBookingId = ?;`, values
        );

        db.query(queryString, (err, results) => {
            if(err){ 
                return res.status(500).json({ status: 500, message: 'Internal server error' });
            }else{
                return res.status(200).json({
                    status: 200, message: 'Successfully deleted movie booking!'
                });
            }
        });              
    },
    viewMovieBookings : (req, res) => {
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }
        if (req.session.secret.UserType === "MEMBER" ){
            return res.status(400).json({
                status: 1034, message: 'You are not an admin!'
            });
        }
        
        const queryString = SqlString.format(
            `CALL viewMovieBookings();`
        );
        
        db.query(queryString, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });  
            }
            if (!results[0].length){
                return res.status(400).json({
                    status: 200, message: 'Successfully get movies, but is empty',
                });
            }
            return res.status(200).json({
                status: 200, message: 'Successfully viewed all movie bookings!',
                data: results[0]
            });
        });
    },
    viewEachBooking: (req, res) => {   
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }
        if (req.session.secret.UserType === "MEMBER" ){
            return res.status(400).json({
                status: 1034, message: 'You are not an admin!'
            });
        }

        const givenUserId = [req.params.UserId];
        const queryString = SqlString.format(
            'CALL viewBookingById(?);', givenUserId
        );

        db.query(queryString, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });
            }
            if (!results[0].length){
                return res.status(400).json({
                    status: 201, message: 'Successfully get movie booking by user, but is empty',
                });
            }
            return res.status(200).json({
                status: 200, message: 'Successfully get movie booking by user',
                data: results[0]
            });
        });
    }
};

module.exports = controller;    