const db = require('../../../database');
var SqlString = require('sqlstring');

const controller = {
    addMovie : (req, res) => {
        if(!req.session.secret){
            return res.status(400).json({
                status: 1005, message: 'You are not signed in'
            });
        }

        const UserType = req.session.secret.UserType;

        if(UserType === "MEMBER"){
            return res.status(400).json({
                status: 1034, message: 'You are not an admin!'
            });
        }

        const Title = req.body.Title;
        const Description = req.body.Description;
        const Place = req.body.Place;
        const Price = req.body.Price;
        const Time = req.body.Time;
        const Date = req.body.Date; 

        if (!Title){
            return res.status(400).json({
                status: 1031, message: 'Title cannot be empty'
            });
        }if (!Description){
            return res.status(400).json({
                status: 1032, message: 'Desription cannot be empty'
            });
        }if (!Place){
            return res.status(400).json({
                status: 1035, message: 'Place cannot be empty'
            });
        }if (!Price){
            return res.status(400).json({
                status: 1034, message: 'Price cannot be empty'
            });
        }if (!Time){
            return res.status(400).json({
                status: 1034, message: 'Time cannot be empty'
            });
        }if (!Date){
            return res.status(400).json({
                status: 1033, message: 'Date cannot be empty'
            });
        }

        const values = [Title, Description, Place, Price, Date, Time];
        const queryString = SqlString.format(
            `CALL addMovie(?, ?, ?, ?, ?, ?)`, values
        );

        db.query(queryString, (err, results) =>{
            
            if (err) {
                console.log(err.message)
                return res.status(500).json({ status: 500, message: 'Internal server error' });
            }return res.status(200).json({
                status: 200, message: 'Successfully added movie!'
            });
        });
    }
};

module.exports = controller;