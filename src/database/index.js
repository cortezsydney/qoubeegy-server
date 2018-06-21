const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'moviebooking',
  password: 'moviebooking',
  db: 'moviebooking',
  dateStrings: true
});

db.connect(err => {
  if (err) {
    console.log('Error in connecting to database');
    console.log(err.message);
  } else {
    console.log('Success in connecting to database');
  }
});

db.query('USE moviebooking');

module.exports = db;