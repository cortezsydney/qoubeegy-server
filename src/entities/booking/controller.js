const db = require('../../database');
var SqlString = require('sqlstring');

const controller = {
    addBooking: (req, res) => {
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }

        const MovieShowingId = req.body.MovieShowingId;
        const UserId = req.session.secret.UserId;
        const Seat = req.body.Seat;
        
        if (!MovieShowingId){
            return res.status(400).json({
                status: 1007, message: 'MovieShowingId cannot be empty!'
            });
        }if (!Seat){
            return res.status(400).json({
                status: 1008, message: 'Seat cannot be empty!'
            });
        }

        const givenSeat = [MovieShowingId, Seat];
        const queryDuplicate = SqlString.format(
            'SELECT Seat from MOVIEBOOKING where MovieShowingId = ? and Seat = ?', givenSeat
        );

        db.query(queryDuplicate, (err, results) =>{
            if(results[0] === undefined){
                const values = [
                    MovieShowingId, UserId, Seat
                ];
                const queryString = SqlString.format(
                    `CALL addMovieBooking(?, ?, ?);`, values
                );
                
                db.query(queryString, (err, results) => {
                    if (err) {
                        return res.status(500).json({ status: 500, message: 'Internal server error' });
                    }
                    return res.status(200).json({
                        status: 200, message: 'Successfully added movie booking!'
                    });
                });
            }else{
                return res.status(400).json({
                    status: 1026, message: 'Seat is already taken'
                });
            }
        })
    },
    deleteBooking: (req, res)=> {
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }
        
        if(req.session.secret.UserType == "ADMIN"){
            
        }

        const values = [req.session.secret.UserId, req.params.MovieBookingId];
        
        if (!req.params.MovieBookingId){
            return res.status(400).json({
                status: 1007, message: 'MovieBookingId cannot be empty!'
            });
        }

        const queryAuthenticate = SqlString.format(
            `SELECT * FROM MOVIEBOOKING where UserId = ? and MovieBookingId = ?;`, values
        );

        db.query(queryAuthenticate, (err, result) => {
            if(!result[0]){ 
                return res.status(400).json({ status: 1038, message: 'Booking not found!' });
            }else{
                const queryString = SqlString.format(
                    `DELETE from MOVIEBOOKING where UserId = ? and MovieBookingId = ?;`, values
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
            }
        });       
    },
    viewBookings: (req, res) => {   
        if (!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in!'
            });
        }

        const givenUserId = [req.session.secret.UserId];
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