const signInController = (repo) =>{
    const controller = {
        signIn : (req, res, next) => {
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

            repo.signIn( Username, Password )
            .then(
                result => {
                    req.session.secret = result[0][0];
                    return res.status(200).json({
                        status: 200, message: 'Successfully signed in user!', data: result[0][0]
                    });
                }
            ).catch(
                err => {
                    let message = "";
                    switch(err){
                        case 400: message="Invalid email or password"; break;
                        case 500: message ="Internal server error"; break;
                    }
                    res.status(err).json({
                        status: err == 400 ? 1015 : err, message
                    });
                }
            )
        },
        signOut : (req, res, next) => {
            req.session.destroy();
            res.status(200).json({
                status: 200, message: 'Successfully logs out'
            });
        }
    };
    return controller;
}

module.exports = signInController;