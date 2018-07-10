const bookingController = (repo) =>{
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

            repo.checkExistingSeat( MovieShowingId, Seat )
            .then(
                result => repo.addBooking( MovieShowingId, UserId, Seat )
            ).then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully added booking!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Seat already taken"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 1026 : err, message
                    });
                }
            )
        },
        deleteBooking: (req, res)=> {
            if (!req.session.secret){
                return res.status(400).json({
                    status: 1005, message: 'You are not signed in!'
                });
            }

            UserId = req.session.secret.UserId;
            MovieBookingId = req.params.MovieBookingId;
            
            if (!MovieBookingId){
                return res.status(400).json({
                    status: 1007, message: 'MovieBookingId cannot be empty!'
                });
            }

            repo.checkExistingBookingId( UserId, MovieBookingId )
            .then(
                result => repo.deleteBooking( UserId, MovieBookingId )
            ).then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully deleted booking!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Booking not found"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 1038 : err, message
                    });
                }
            )      
        },
        viewBookings: (req, res) => {   
            if (!req.session.secret){
                return res.status(400).json({
                    status: 1005, message: 'You are not signed in!'
                });
            }

            const UserId = req.session.secret.UserId;
            repo.viewBooking( UserId )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all bookings by user!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty bookings by user"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 1038 : err, message
                    });
                }
            )     
        }
    };
    return controller;
}

module.exports = bookingController;