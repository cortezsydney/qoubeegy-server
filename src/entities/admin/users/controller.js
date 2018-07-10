const adminUserController = (repo) =>{
    const controller = {
        viewUsers : (req, res) => {
            if (!req.session.secret){
                return res.status(400).json({
                    status: 1005, message: 'You are not signed in!'
                });
            }
            if (req.session.secret.UserType === "MEMBER"){
                return res.status(400).json({
                    status: 1034, message: 'You are not an admin!'
                });
            }
            
            repo.viewUsers()
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all users!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty user!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            )  
        },
        viewRequest : (req, res) => {
            if (!req.session.secret){
                return res.status(400).json({
                    status: 1005, message: 'You are not signed in!'
                });
            }
            if (req.session.secret.UserType === "MEMBER"){
                return res.status(400).json({
                    status: 1034, message: 'You are not an admin!'
                });
            }
    
            repo.viewRequest()
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all request!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty request!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            ) 

            // const queryString = SqlString.format(
            //     `SELECT USER.*, REQUEST.TimeDate FROM USER NATURAL JOIN REQUEST;`
            // );
            
            // db.query(queryString, (err, results) => {
            //     if (err) {
            //         return res.status(500).json({ status: 500, message: 'Internal server error' });  
            //     }
            //     if (!results.length){
            //         return res.status(400).json({
            //             status: 201, message: 'Successfully get request, but is empty',
            //         });
            //     }
            //     return res.status(200).json({
            //         status: 200, message: 'Successfully viewed all requests!',
            //         data: results
            //     });
            // });
        },
        deleteUser : (req, res) => {
            if (!req.session.secret){
                return res.status(400).json({
                    status: 1005, message: 'You are not signed in!'
                });
            }
            if (req.session.secret.UserType === "MEMBER"){
                return res.status(400).json({
                    status: 1034, message: 'You are not an admin!'
                });
            }
            
            const UserId = req.params.UserId;
            repo.deleteUser( UserId )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully deleted a user!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 500: message ="Internal server error"; break;
                    }
                }
            ) 

            // const value = [req.params.UserId];
            // console.log(value + "backend")
            // const queryString = SqlString.format(
            //     `CALL deleteUser(?);`, value 
            // );
            

            // db.query(queryString, (err, results) => {
            //     if (err) {
            //         return res.status(500).json({ status: 500, message: 'Internal server error' });  
            //     }
            //     return res.status(200).json({
            //         status: 200, message: 'Successfully deleted user!'
            //     });
            // });
        },
        viewEachFavorite: (req, res) => {
            if (!req.session.secret){
                return res.status(400).json({
                    status: 1005, message: 'You are not signed in!'
                });
            }
            if (req.session.secret.UserType === "MEMBER"){
                return res.status(400).json({
                    status: 1034, message: 'You are not an admin!'
                });
            }

            const UserId = [req.params.UserId];
            repo.viewEachFavorite( UserId )
            .then(
                result => {
                    return res.status(200).json({
                        status: 200, message: 'Successfully viewed all favorite by user!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Empty favorite by user!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 201 : err, message
                    });
                }
            ) 

            // const givenUserId = [req.params.UserId];
            // const querySearch = SqlString.format(
            //     `SELECT FAVORITE.*, MOVIE.* from FAVORITE NATURAL JOIN MOVIE where FAVORITE.UserId = ?`, givenUserId
            // );

            // db.query(querySearch, (err, result) => {
            //     if(err){ 
            //         return res.status(500).json({ status: 500, message: 'Internal server error' });
            //     }

            //     if (!result.length){
            //         return res.status(400).json({
            //             status: 201, message: 'Successfully get favorite, but is empty',
            //         });
            //     }

            //     return res.status(200).json({
            //         status: 200, message: 'Successfully view favorite!',
            //         data: result
            //     });
                
            // });          
        }
    };
    return controller;
}

module.exports = adminUserController;