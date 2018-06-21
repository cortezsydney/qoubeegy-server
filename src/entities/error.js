const validator = require('validator')

exports.checkError = function(fields, res) {
    Object.entries(fields).forEach(field => {
        if (!field[1]) {
            return res.status(400).json({
                status: 400,
                message: `${field[0]} cannot be empty`
            });
        }  
        // if (field[0] === 'Password') {
        //     if (field[1].length < 4 || field[1].length > 16){
        //         return res.status(400).json({
        //             status: 1011, message: 'Invalid password, password must be 4 - 16 characters long'
        //         });
        //     }
        //     if (!validator.isAlphanumeric(field[1])){
        //         return res.status(400).json({
        //             status: 1012, message: 'Invalid password, must only contain alphanumeric characters'
        //         });
        //     }
        // }
        // if (field[0] === 'Username' && validator.isEmail(field[1])){
        //     return res.status(400).json({
        //         status: 1013, message: 'Invalid email'
        //     });
        // }  
    });
}