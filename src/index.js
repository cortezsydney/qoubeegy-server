const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const store = require('express-mysql-session');
const db = require('./database');
const router = require('./router');
const allowCors = require('./middleware/allowCors');
const cors = require('cors');
const app = express();
app.use(express.json());
const MySQLStore = store(session);
const sessionStore = new MySQLStore({}, db);

app.use(bodyParser.json());
// 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(
  session({
    key: 'moviebooking',
    secret: 'moviebooking',
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    createDatabaseTable: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    secret: 'undefined',
    saveUninitialized: true,
  })
);
// app.use(session({secret: 'secret'}));
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// app.use(allowCors());


app.use('/api', router);


const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});

module.exports = server;