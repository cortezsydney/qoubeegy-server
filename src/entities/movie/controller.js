const db = require('../../database');
var SqlString = require('sqlstring');

const controller = {
    viewMovies : (req, res) => {
        const queryString = SqlString.format(
            `CALL viewMovies();`
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
                status: 200, message: 'Successfully viewed movies!',
                data: results[0]
            });
        });
    },
    viewMovieHouses : (req, res) => {
        const queryString = SqlString.format(
            `CALL viewMovieHouses();`
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
                status: 200, message: 'Successfully viewed movie houses!',
                data: results[0]
            });
        });
    },
    viewMovieShowingSchedules : (req, res) => {
        const queryString = SqlString.format(
            `CALL viewMovieShowingSchedules();`
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
                status: 200, message: 'Successfully viewed movie showing schedules!',
                data: results[0]
            });
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
    viewShowingByTitle: (req, res) => {  
        if (!req.params.Title){
            return res.status(400).json({
                status: 1031, message: 'Title cannot be empty!'
            });
        }

        const value = [req.params.Title];
        const queryString = SqlString.format(
            `CALL viewShowingByTitle(?);`, value
        );
        
        db.query(queryString, (err, results) => {
            console.log(results);
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });  
            }
            if (!results[0].length){
                return res.status(400).json({
                    status: 1025, message: 'Movie Showing not found!'
                });
            }
            return res.status(200).json({
                status: 200, message: 'Successfully viewed movies by title!',
                data: results[0]
            });
        });
    },
    viewShowingByPlace: (req, res) => {  
        if (!req.params.Place){
            return res.status(400).json({
                status: 1035, message: 'Place cannot be empty!'
            });
        }

        const value = [req.params.Place];
        const queryString = SqlString.format(
            `CALL viewShowingByPlace(?);`, value
        );
        
        db.query(queryString, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });  
            }
            if (!results[0].length){
                return res.status(400).json({
                    status: 1025, message: 'Movie Showing not found'
                });
            }
            return res.status(200).json({
                status: 200, message: 'Successfully viewed movies by place!',
                data: results[0]
            });
        });
    },
    viewShowingByPlaceAndTitle: (req, res) => {  
        if (!req.body.Place){
            return res.status(400).json({
                status: 1035, message: 'Place cannot be empty!'
            });
        }
        if (!req.body.Title){
            return res.status(400).json({
                status: 1031, message: 'Title cannot be empty!'
            });
        }

        const values= [req.body.Place, req.body.Title];
        const queryString = SqlString.format(
            `CALL viewShowingByPlaceAndTitle(?, ?);`, values
        );
        
        db.query(queryString, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });  
            }
            if (!results[0].length){
                return res.status(400).json({
                    status: 1025, message: 'Movie Showing not found'
                });
            }
            return res.status(200).json({
                status: 200, message: 'Successfully viewed movies by place and title!',
                data: results[0]
            });
        });
    },
    viewHouseByTitle: (req, res) => {  
        if (!req.params.Title){
            return res.status(400).json({
                status: 1031, message: 'Title cannot be empty!'
            });
        }

        const value = [req.params.Title];
        const queryString = SqlString.format(
            `CALL viewHouseByTitle(?);`, value
        );
        
        db.query(queryString, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });  
            }
            if (!results[0].length){
                return res.status(400).json({
                    status: 1025, message: 'Movie Showing not found'
                });
            }
            return res.status(200).json({
                status: 200, message: 'Successfully viewed movie houses by title!',
                data: results[0]
            });
        });
    },
    viewMovie : (req, res) => {
        if (!req.params.Title){
            return res.status(400).json({
                status: 1031, message: 'Title cannot be empty!'
            });
        }

        const value = [req.params.Title];
        const queryString = SqlString.format(
            `SELECT Title, Description from MOVIE where Title = ?;`, value
        );
        
        db.query(queryString, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Internal server error' });  
            }
            if (!results.length){
                return res.status(400).json({
                    status: 1025, message: 'Movie not found'
                });
            }
            return res.status(200).json({
                status: 200, message: 'Successfully viewed details of movie!', 
                data: results[0]
            });
        });
    }
};

module.exports = controller;