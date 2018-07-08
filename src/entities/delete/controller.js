const db = require('../../database');
var SqlString = require('sqlstring');

const controller = {
    searchBookings : (req, res) => {
        const queryString = SqlString.format(
            `
            SELECT *  FROM 
            USER NATURAL JOIN MOVIEHOUSE NATURAL JOIN  MOVIESHOWING NATURAL JOIN MOVIE NATURAL JOIN MOVIEBOOKING 
            where MOVIE.Title LIKE CONCAT('%', ?, '%');`
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
    }
}
