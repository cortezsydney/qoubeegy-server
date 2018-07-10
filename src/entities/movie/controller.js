
const movieController = (repo) =>{
    const controller = {
        viewMovie : (req, res) => {
            if (!req.params.Title){
                return res.status(400).json({
                    status: 1031, message: 'Title cannot be empty!'
                });
            }

            const Title = [req.params.Title];
            repo.viewMovie( Title )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed a movie!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewMovies : (req, res) => {
            repo.viewMovies()
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all movies!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewDistinctMovies : (req, res) => {
            repo.viewDistinctMovies()
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all distinct movies!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewDistinctMoviesByTitle : (req, res) => {
            if (!req.params.Title){
                return res.status(400).json({
                    status: 1035, message: 'Place cannot be empty!'
                });
            }

            const Title = [req.params.Title]
            repo.viewDistinctMoviesByTitle( Title )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all distinct movies by title!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewHouseByTitle: (req, res) => {  
            if (!req.params.Title){
                return res.status(400).json({
                    status: 1031, message: 'Title cannot be empty!'
                });
            }

            const Title = [req.params.Title];
            repo.viewHouseByTitle( Title )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all movies!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewMovieHouses : (req, res) => {
            repo.viewMovieHouses()
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all movie houses!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies houses!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewShowingByTitle: (req, res) => {  
            if (!req.params.Title){
                return res.status(400).json({
                    status: 1031, message: 'Title cannot be empty!'
                });
            }

            const Title = [req.params.Title];
            repo.viewShowingByTitle( Title )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all showing by title!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewShowingByPlace: (req, res) => {  
            if (!req.params.Place){
                return res.status(400).json({
                    status: 1035, message: 'Place cannot be empty!'
                });
            }

            const Place = [req.params.Place];
            repo.viewShowingByPlace( Place )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all movies by place!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
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

            const Place = req.body.Place;
            const Title = req.body.Title;
            repo.viewShowingByPlaceAndTitle(Place, Title)
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all showing by place and title!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movies!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )
        },
        viewMovieShowingSchedules : (req, res) => {
            repo.viewMovieShowingSchedules()
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all movie schedules!', data: result[0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty movie schedules!"; break;
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

module.exports = movieController;