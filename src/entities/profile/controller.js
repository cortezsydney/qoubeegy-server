const validator = require('validator');

// const controller = {
//     deleteUser:  (req, res)=> {
//         if (!req.session.secret){
//             return res.status(400).json({
//                 status: 1005, message: 'You are not signed in!'
//             });
//         }
        
//         const givenUserId = [req.session.secret.UserId];
//         const queryString = SqlString.format(
//             `CALL deleteUser(?);`, givenUserId
//         );

//         db.query(queryString, (err, result) => {
//             if(err){ 
//                 console.log(err.message);
//                 return res.status(500).json({ status: 500, message: 'Internal server error' });
//             }else{
//                 req.session.destroy();
//                 return res.status(200).json({
//                     status: 200, message: 'Successfully deleted your profile! You are automatically logged out.'
//                 });
//             }
//         });
                       
//     },


const profileController = (repo) =>{
    const controller = {
        editUser : (req, res, next) => {
            if (!req.session.secret){
                res.status(400);
                return res.json({
                    status: 1005, message: 'UserId cannot be empty, you are not signed in'
                });
            }
            
            const UserId = req.session.secret.UserId;
            const FirstName = req.body.FirstName;
            const LastName = req.body.LastName;
            const NewPassword = req.body.NewPassword;
            const OldPassword = req.body.OldPassword;
    
            if (!FirstName){
                res.status(400);
                return res.json({
                    status: 1002, message: 'First Name cannot be empty'
                });
            }
            if (!LastName){
                res.status(400);
                return res.json({
                    status: 1003, message: 'Last Name cannot be empty'
                });
            }
            if (!OldPassword){
                res.status(400);
                return res.json({
                    status: 1006, message: 'Old Password cannot be empty'
                });
            }
            if (!NewPassword){
                res.status(400);
                return res.json({
                    status: 1004, message: 'Password cannot be empty'
                });
            }
            if (NewPassword.length < 4 || NewPassword.length > 16){
                res.status(400);
                return res.json({
                    status: 1011, message: 'Invalid password, password must be 4 - 16 characters long'
                });
            }
            if (!validator.isAlphanumeric(NewPassword)){
                res.status(400);
                return res.json({
                    status: 1012, message: 'Invalid password, must only contain alphanumeric characters'
                });
            }

            repo.checkPassword(OldPassword, UserId)
            .then(
                result => repo.editUser(UserId, FirstName, LastName, NewPassword)
            ).then(
                result => {
                    res.status(200);
                    return res.json({
                        status: 200, message: 'Successfully edited user!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Invalid password"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err);
                    return res.json({
                        status: err == 400 ? 1016 : err, message
                    });
                }
            )
        },
        sendRequest: (req, res) =>{
            if (!req.session.secret){
                res.status(400);
                return res.json({
                    status: 1005, message: 'You are not signed in'
                });
            }

            if (req.session.secret.UserType === "ADMIN"){
                res.status(400);
                return res.json({
                    status: 1036, message: 'Already an admin!'
                });
            }

            const UserId = req.session.secret.UserId;
            repo.checkExistingRequest( UserId )
            .then(
                result => repo.sendRequest( UserId )
            ).then(
                result => {
                    res.status(200);
                    return res.json({
                        status: 200, message: 'Successfully send a request!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Request is existing!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err);
                    return res.json({
                        status: err == 400 ? 1022 : err, message
                    });
                }
            )
        },
        approveRequest: (req, res) => {
            if (!req.session.secret){
                res.status(400);
                return res.json({
                    status: 1005, message: 'You are not signed in'
                });
            }
            if (req.session.secret.UserType === "MEMBER" ){
                res.status(400);
                return res.json({
                    status: 1034, message: 'You are not an admin!'
                });
            }
            if (!req.params.UserId){
                res.status(400);
                return res.json({
                    status: 1023, message: 'Request cannot be empty!'
                });
            }
            
            const UserId = req.params.UserId;
            repo.checkExistingRequestTwo( UserId )
            .then(
                result => repo.approveRequest( UserId )
            ).then(
                result => {
                    res.status(200);
                    return res.json({
                        status: 200, message: 'Successfully approved request!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Request not found!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err);
                    return res.json({
                        status: err == 400 ? 1037 : err, message
                    });
                }
            )        
        },
        rejectRequest: (req, res)=> {
            if (!req.session.secret){
                res.status(400);
                return res.json({
                    status: 1005, message: 'You are not signed in'
                });
            }
            if (req.session.secret.UserType === "MEMBER"){
                res.status(400);
                return res.json({
                    status: 1034, message: 'You are not an admin!'
                });
            }
            if (!req.params.UserId){
                res.status(400);
                return res.json({
                    status: 1023, message: 'Request not found!'
                });
            }
            
            const UserId = req.params.UserId;
            repo.checkExistingRequestTwo( UserId )
            .then(
                result => repo.rejectRequest( UserId )
            ).then(
                result => {
                    res.status(200);
                    return res.json({
                        status: 200, message: 'Successfully deleted request!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Request not found!"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err);
                    return res.json({
                        status: err == 400 ? 1037 : err, message
                    });
                }
            )                
        },
        addFavorite: (req, res) => {
            if (!req.session.secret){
                res.status(400);
                return res.json({
                    status: 1005, message: 'You are not signed in'
                });
            }
    
            if (!req.body.MovieId){
                res.status(400);
                return res.json({
                    status: 1039, message: 'MovieId cannot be empty!'
                });
            }
            
            const MovieId = req.body.MovieId;
            const UserId = req.session.secret.UserId;
            repo.checkExistingMovieId( MovieId )
            .then(
                result => repo.addFavorite( MovieId , UserId )
            ).then(
                
                result => {
                    res.status(200);
                    return res.json({
                        status: 200, message: 'Successfully added favorite!'
                    });
                }
            ).catch(
                
                err => {
                    console.log("me")
                    let message = "";
                    switch(err){
                        case 400: message = "Movie not found!"; break;
                        case 500: message = "Internal server error"; break;
                    }
                    res.status(err);
                    return json({
                        status: err == 400 ? 1037 : err, message
                    });
                }
            )                
        },
        deleteFavorite: (req, res) => {
            if (!req.session.secret){
                res.status(400);
                return res.json({
                    status: 1005, message: 'You are not signed in!'
                });
            }
    
            if (!req.params.FavoriteId){
                res.status(400);
                return res.json({
                    status: 1039, message: 'FavoriteId cannot be empty!'
                });
            }
            
            const FavoriteId = req.params.FavoriteId;
            repo.checkExistingFavoriteId( FavoriteId )
            .then(
                result => repo.deleteFavorite( FavoriteId )
            ).then(
                result => {
                    res.status(200);
                    return res.json({
                        status: 200, message: 'Successfully deleted favorite!'
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message = "Favorite not found!"; break;
                        case 500: message = "Internal server error"; break;
                    }
                    res.status(err);
                    return res.json({
                        status: err == 400 ? 1037 : err, message
                    });
                }
            )                
        }, 
        viewFavorite: (req, res) => {
            if (!req.session.secret){
                res.status(400);
                return res.json({
                    status: 1005, message: 'You are not signed in!'
                });
            }

            const UserId = req.session.secret.UserId;
            repo.viewFavorite( UserId )
            .then(
                result => {
                    res.status(200);
                    return res.json({
                        status: 200, message: 'Successfully viewed favorite!', data: result
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 500: message = "Internal server error"; break;
                    }
                }
            )                
        },
        getSession: (req, res) => {
            res.status(200);
            return res.json({
                status: 200, message: 'Successfully get session!',
                data: req.session.secret
            });
        }

    }
    return controller;
}

module.exports = profileController;