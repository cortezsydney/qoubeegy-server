const adminBookingController = (repo) =>{
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

            const MovieBookingId = [req.params.MovieBookingId];
            repo.checkExistingMovieBookingId( MovieBookingId )
            .then(
                result => repo.deleteBooking( MovieBookingId )
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
                        case 400: message="MovieBookingId not found"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 1007 : err, message
                    });
                }
            )              
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
            
            repo.viewMovieBookings()
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all bookings!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Movie Booking is empty"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )  
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

            const UserId = [req.params.UserId];
            repo.viewEachBooking(UserId)
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
                        case 400: message="Movie Booking is empty"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )  
        }
    };
    return controller;
}

module.exports = adminBookingController;    