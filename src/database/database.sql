DROP USER IF EXISTS 'moviebooking'@'localhost';
CREATE USER 'moviebooking'@'localhost' IDENTIFIED WITH mysql_native_password BY 'moviebooking';
GRANT SUPER ON *.* TO 'moviebooking'@'localhost';
GRANT ALL PRIVILEGES ON moviebooking.* TO 'moviebooking'@'localhost' WITH GRANT OPTION;
DROP DATABASE IF EXISTS moviebooking;
CREATE DATABASE moviebooking;
USE moviebooking;

CREATE TABLE USER (
  UserId INT NOT NULL AUTO_INCREMENT,
  Username VARCHAR(20) NOT NULL,
  FirstName VARCHAR(40) NOT NULL, 
  LastName VARCHAR(40) NOT NULL,
  Password VARCHAR(256) NOT NULL,
  UserType ENUM("ADMIN", "MEMBER"),  
  Since TIMESTAMP NOT NULL,
  UNIQUE (Username),
  PRIMARY KEY (UserId)
);

CREATE TABLE REQUEST(
  RequestId INT NOT NULL AUTO_INCREMENT,
  UserId INT NOT NULL,
  TimeDate TIMESTAMP NOT NULL,
  FOREIGN KEY (UserId) REFERENCES USER(UserId),
  UNIQUE (UserId),
  PRIMARY KEY (RequestId)
);

CREATE TABLE MOVIE (
    MovieId INT NOT NULL AUTO_INCREMENT,
    Title VARCHAR(20) NOT NULL,
    Description VARCHAR(40) NOT NULL,
    Photo VARCHAR(40) NOT NULL,
    Details LONGTEXT NOT NULL,
    UNIQUE(Title), 
    PRIMARY KEY (MovieId)
);

CREATE TABLE FAVORITE(
  FavoriteId INT NOT NULL AUTO_INCREMENT,
  UserId INT NOT NULL,
  MovieId INT NOT NULL,
  FOREIGN KEY (UserId) REFERENCES USER(UserId),
  FOREIGN KEY (MovieId) REFERENCES MOVIE(MovieId),
  UNIQUE(FavoriteId)
);

CREATE TABLE MOVIEHOUSE (
    MovieHouseId INT NOT NULL AUTO_INCREMENT,
    Place VARCHAR(20) NOT NULL,
    Price DECIMAL(8,2) NOT NULL,
    UNIQUE (Place),
    PRIMARY KEY (MovieHouseId)
);

CREATE TABLE MOVIESHOWING (
    MovieShowingId INT NOT NULL AUTO_INCREMENT,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    MovieId INT NOT NULL,
    MovieHouseId INT NOT NULL,
    PRIMARY KEY (MovieShowingId),
    FOREIGN KEY (MovieId) REFERENCES MOVIE(MovieId),
    FOREIGN KEY (MovieHouseId) REFERENCES MOVIEHOUSE(MovieHouseId)
);

CREATE TABLE COUPON (
    CouponId INT NOT NULL AUTO_INCREMENT,
    Discount INT NOT NULL,
    UserId INT NOT NULL,
    PRIMARY KEY (CouponId)
);

CREATE TABLE MOVIEBOOKING (
    MovieBookingId INT NOT NULL AUTO_INCREMENT,
    MovieShowingId INT NOT NULL,
    UserId INT NOT NULL,
    Seat VARCHAR(3) NOT NULL,
    PRIMARY KEY (MovieBookingId),
    FOREIGN KEY (MovieShowingId) REFERENCES MOVIESHOWING(MovieShowingId),
    FOREIGN KEY (UserId) REFERENCES USER(UserId)
);

DROP PROCEDURE IF EXISTS addMovie;
DROP PROCEDURE IF EXISTS deleteMovie;
DROP PROCEDURE IF EXISTS addUser;
DROP PROCEDURE IF EXISTS editUser;
DROP PROCEDURE IF EXISTS viewMovies;
DROP PROCEDURE IF EXISTS viewMovieHouses;
DROP PROCEDURE IF EXISTS viewScheduleBooking;
DROP PROCEDURE IF EXISTS addMovieBooking;
DROP PROCEDURE IF EXISTS viewShowingByTitle;
DROP PROCEDURE IF EXISTS viewShowingByPlace;
DROP PROCEDURE IF EXISTS viewShowingByPlaceAndTitle;
DROP PROCEDURE IF EXISTS viewHouseByTitle;
DROP PROCEDURE IF EXISTS viewShowingByHouse;
DROP PROCEDURE IF EXISTS addCoupon;

DELIMITER GO

CREATE PROCEDURE addCoupon(Discount INT, UserId INT)
    BEGIN 
      INSERT INTO COUPON VALUES (NULL, Discount, UserId);
    END;
GO

CREATE PROCEDURE deleteUser(givenUserId INT)
  BEGIN
        DELETE from FAVORITE where UserId = givenUserId;
        DELETE from REQUEST where UserId = givenUserId; 
        DELETE from MOVIEBOOKING where UserId = givenUserId;
        DELETE from USER where UserId = givenUserId; 
  END;
GO

CREATE PROCEDURE useCoupon(givenCouponId INT, givenMovieBookingId INT)
    BEGIN 

      DELETE FROM COUPON where CouponId = givenCouponId;
    END;
GO

CREATE PROCEDURE viewShowingByTitle(Title VARCHAR(20))
    BEGIN 
      SELECT DISTINCT MOVIE.*, MOVIESHOWING.MovieShowingId,  MOVIEHOUSE.Place, MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Price 
      from MOVIEHOUSE NATURAL JOIN  MOVIESHOWING NATURAL JOIN MOVIE
      WHERE MOVIE.Title LIKE CONCAT('%', Title, '%');
    END;
GO
  
CREATE PROCEDURE viewShowingByPlace(Place VARCHAR(20))
    BEGIN 
      SELECT MOVIE.*, MOVIESHOWING.MovieShowingId, MOVIEHOUSE.Place, MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Price
      from MOVIEHOUSE NATURAL JOIN MOVIESHOWING NATURAL JOIN MOVIE
      where MOVIEHOUSE.Place LIKE CONCAT('%', Place, '%');
    END;
GO

CREATE PROCEDURE viewShowingByPlaceAndTitle(Place VARCHAR(20), Title VARCHAR(20))
    BEGIN 
      SELECT MOVIE.*, MOVIESHOWING.MovieShowingId, MOVIEHOUSE.Place, MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Price
      from MOVIEHOUSE NATURAL JOIN MOVIESHOWING NATURAL JOIN MOVIE
      where MOVIEHOUSE.Place LIKE CONCAT('%', Place, '%') and MOVIE.Title LIKE CONCAT('%', Title, '%');
    END;
GO

CREATE PROCEDURE viewHouseByTitle(Title VARCHAR(20))
    BEGIN 
      SELECT MOVIEHOUSE.MovieHouseId, MOVIE.*,  MOVIEHOUSE.Place, MOVIEHOUSE.Price
      from MOVIEHOUSE NATURAL JOIN MOVIESHOWING NATURAL JOIN MOVIE
      where MOVIE.Title LIKE CONCAT('%', Title, '%');
    END;
GO

CREATE PROCEDURE addUser(
        Username VARCHAR(20),
        FirstName VARCHAR(40), 
        LastName VARCHAR(40), 
        Password VARCHAR(40),
        UserType ENUM("ADMIN", "MEMBER")
    )
    BEGIN INSERT INTO USER
      values (NULL, Username, FirstName, LastName, sha2(Password,256), UserType, NOW());
    END;
GO

/* */
CREATE PROCEDURE editUser(
        sessionUserId INT,
        givenFirstName VARCHAR(40), 
        givenLastName VARCHAR(40), 
        givenPassword VARCHAR(20)
    )
    BEGIN UPDATE USER SET
        FirstName = givenFirstName,
        LastName = givenLastName,
        Password = sha2(givenPassword,256)
    WHERE UserId = sessionUserId;
    SELECT * from USER where UserId = sessionUserId;
    END;
GO

CREATE PROCEDURE viewMovies()
  BEGIN 
    SELECT * FROM MOVIE ORDER BY Title;
  END;
GO

CREATE PROCEDURE viewMovie()
  BEGIN 
    SELECT * FROM MOVIE;
  END;
GO

CREATE PROCEDURE viewMovieHouses(Place VARCHAR(20))
  BEGIN 
    select MOVIE.*,  MOVIEHOUSE.Place, MOVIEHOUSE.Price from MOVIEHOUSE NATURAL JOIN  MOVIESHOWING NATURAL JOIN MOVIE;
  END;
GO

CREATE PROCEDURE viewMovieShowingSchedules()
  BEGIN 
    select MOVIE.*, MOVIESHOWING.MovieShowingId, MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Place from MOVIESHOWING NATURAL JOIN MOVIE NATURAL JOIN MOVIEHOUSE
      ORDER BY MOVIESHOWING.Date ASC, MOVIESHOWING.Time;
  END;
GO

  CREATE PROCEDURE deleteShowing(givenMovieShowingId INT)
  BEGIN
  DELETE from MOVIEBOOKING where MovieShowingId = givenMovieShowingId; DELETE from MOVIESHOWING where MovieShowingId = givenMovieShowingId;

  END;
  GO

CREATE PROCEDURE deleteMovie(givenMovieId INT)
  BEGIN 
    DELETE FROM FAVORITE where MovieId = givenMovieId;
    DELETE FROM MOVIESHOWING where MovieId = givenMovieId;
    DELETE FROM MOVIE where MovieId = givenMovieId;
    DELETE FROM MOVIEBOOKING where MovieId = givenMovieId;
  END;
GO

CREATE PROCEDURE viewMovieBookings()
  BEGIN 
    SELECT MOVIE.*, MOVIEBOOKING.MovieBookingId, USER.Username, MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Place, MOVIEBOOKING.Seat, MOVIEHOUSE.Price FROM USER NATURAL JOIN MOVIEHOUSE NATURAL JOIN  MOVIESHOWING NATURAL JOIN MOVIE NATURAL JOIN MOVIEBOOKING
      ORDER BY MOVIESHOWING.Date ASC, MOVIESHOWING.Time;
  END;
GO

CREATE PROCEDURE addMovieBooking(
        MovieShowingId INT, 
        UserId INT, 
        Seat VARCHAR(3)
    )
  BEGIN 
    INSERT INTO MOVIEBOOKING
        VALUES (NULL, MovieShowingId, UserId, Seat);
  END;
GO

DELIMITER ;

DROP PROCEDURE IF EXISTS userSignIn;

DELIMITER GO

CREATE PROCEDURE userSignIn(
      givenUsername VARCHAR(20),
      givenPassword VARCHAR(256)
    )
  BEGIN 
    SELECT UserId, Username, FirstName, LastName, UserType FROM USER WHERE Username = givenUsername and Password = sha2(givenPassword, 256);
  END;
GO

DELIMITER ;


DROP PROCEDURE IF EXISTS viewBookingById;
DROP PROCEDURE IF EXISTS addRequest;
DROP PROCEDURE IF EXISTS addAdmin;

DELIMITER GO
CREATE PROCEDURE viewBookingById(givenUserId INT)
  BEGIN 
    SELECT MOVIE.*,  MOVIEBOOKING.MovieBookingId, MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Place, MOVIEBOOKING.Seat, MOVIEHOUSE.Price 
    FROM USER NATURAL JOIN MOVIEHOUSE NATURAL JOIN MOVIESHOWING NATURAL JOIN MOVIE NATURAL JOIN MOVIEBOOKING 
    WHERE USER.UserId = givenUserId ORDER BY MOVIESHOWING.Date ASC, MOVIESHOWING.Time;
  END;
GO

CREATE PROCEDURE addRequest(
        UserId INT
      )
    BEGIN
      INSERT INTO REQUEST VALUES (NULL, UserId, NOW());
    END;
GO

CREATE PROCEDURE addAdmin(
        givenUserId INT
      )
    BEGIN
      UPDATE USER SET UserType = "ADMIN" where UserId = givenUserId;
      DELETE FROM REQUEST where UserId = givenUserId;
    END;
GO

CREATE PROCEDURE addFavorite(
        givenMovieId INT,
        givenUserId INT
      )
    BEGIN
      IF NOT EXISTS (SELECT * FROM FAVORITE WHERE UserId = givenUserId and MovieId = givenMovieId) THEN
        INSERT INTO FAVORITE VALUES (NULL, givenUserId, givenMovieId);
      END IF;
    END;
GO

CREATE PROCEDURE deleteFavorite(
        givenFavoriteId INT
      )
    BEGIN
      DELETE from FAVORITE where FavoriteId = givenFavoriteId;
    END;
GO

CREATE PROCEDURE addMovie(
        givenTitle VARCHAR(20),
        givenDescription VARCHAR(40),
        givenPlace VARCHAR(20),
        givenPrice DECIMAL(8,2),
        givenDate DATE,
        givenTime TIME,
        givenPhoto VARCHAR(40),
        givenDetails LONGTEXT
      )
    BEGIN
      IF NOT EXISTS (SELECT * FROM MOVIE WHERE Title = givenTitle) THEN 
        INSERT INTO MOVIE VALUES (NULL, givenTitle, givenDescription, givenPhoto, givenDetails);
      END IF;
      IF NOT EXISTS (SELECT * FROM MOVIEHOUSE WHERE Place = givenPlace) THEN
        INSERT INTO MOVIEHOUSE VALUES (NULL, givenPlace, givenPrice);
      END IF;
      IF NOT EXISTS (SELECT * FROM MOVIEHOUSE NATURAL JOIN  MOVIESHOWING NATURAL JOIN MOVIE
      WHERE MOVIE.Title = givenTitle AND MOVIEHOUSE.Place = givenPlace AND MOVIEHOUSE.Price AND
      MOVIESHOWING.Date = givenDate AND MOVIESHOWING.Time = givenTime) 
      THEN
        INSERT INTO moviebooking.MOVIESHOWING(MovieShowingId, Date, Time, MovieId, MovieHouseId) 
        values (NULL, givenDate, givenTime, 
        (select MovieId from moviebooking.MOVIE where Title = givenTitle),
        (select MovieHouseId from moviebooking.MOVIEHOUSE where Place = givenPlace)) ;
      END If;  
  END;
GO

CREATE PROCEDURE addMovieShowing(
        givenMovieId INT,
        givenMovieHouseId INT,
        givenDate DATE,
        givenTime TIME
      )
    BEGIN
      
        INSERT INTO MOVIESHOWING(MovieShowingId, Date, Time, MovieId, MovieHouseId) 
        values (NULL, givenDate, givenTime, givenMovieId, givenMovieHouseId);
     
  END;
GO

CREATE PROCEDURE searchUserBooking(matcher VARCHAR(20), givenUserId INT)
  BEGIN 
    SELECT MOVIEBOOKING.MovieBookingId, USER.Username, MOVIE.Title, 
    MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Place, MOVIEBOOKING.Seat, MOVIEHOUSE.Price FROM 
    USER NATURAL JOIN MOVIEHOUSE NATURAL JOIN  MOVIESHOWING NATURAL JOIN MOVIE NATURAL JOIN MOVIEBOOKING 
    where MOVIE.Title LIKE CONCAT('%', matcher, '%') or MOVIESHOWING.Date LIKE CONCAT('%', matcher, '%') or
    MOVIESHOWING.Time LIKE CONCAT('%', matcher, '%') or MOVIEHOUSE.Place LIKE CONCAT('%', matcher, '%') or
    MOVIEBOOKING.Seat LIKE CONCAT('%', matcher, '%') or MOVIEHOUSE.Price LIKE CONCAT('%', matcher, '%') and
    USER.UserId = givenUserId;
  END;
GO

CREATE PROCEDURE searchBooking(matcher VARCHAR(20), givenUserId INT)
  BEGIN 
    SELECT MOVIEBOOKING.MovieBookingId, USER.Username, MOVIE.Title, 
    MOVIESHOWING.Date, MOVIESHOWING.Time, MOVIEHOUSE.Place, MOVIEBOOKING.Seat, MOVIEHOUSE.Price 
    FROM 
    USER NATURAL JOIN MOVIEHOUSE NATURAL JOIN  MOVIESHOWING NATURAL JOIN MOVIE NATURAL JOIN MOVIEBOOKING 
    where MOVIE.Title LIKE CONCAT('%', matcher, '%') or MOVIESHOWING.Date LIKE CONCAT('%', matcher, '%') or
    MOVIESHOWING.Time LIKE CONCAT('%', matcher, '%') or MOVIEHOUSE.Place LIKE CONCAT('%', matcher, '%') or
    MOVIEBOOKING.Seat LIKE CONCAT('%', matcher, '%') or MOVIEHOUSE.Price LIKE CONCAT('%', matcher, '%');
  END;
GO

GO
      
DELIMITER ;


call addMovie("Deadpool 2", "R16    |    2h 5min", "SM Makati", "230.99", "2018-07-01","10:00:00", "deadpool.jpg", "https://www.foxmovies.com/movies/deadpool-2");
call addMovie("Friends", "R13    |    1h 40min", "SM MOA", "220.000", "2018-06-15","20:00:00", "friends.jpg", "https://www.imdb.com/title/tt0108778/");
call addMovie("Incredibles 2", "PG    |    2h 12min", "SM Aura", "280", "2018-06-15","18:00:00", "incredibles.jpg", "https://www.rottentomatoes.com/m/incredibles_2/");
call addMovie("HTTY Dragon", "PG    |    1h 53min", "SM Makati", "250", "2018-06-27","12:00:00", "httyd.jpg", "https://www.imdb.com/title/tt1646971/");
call addMovie("Deadpool 2", "R16    |    2h 5min", "SM Makati", "230.99", "2018-06-30","13:00:00", "deadpool.jpg", "https://www.foxmovies.com/movies/deadpool-2");
call addMovie("Inception", "R16    |    2h 5min", "SM Calamba", "100.99", "2018-06-11","15:00:00", "inception.jpg", "https://www.imdb.com/title/tt1375666/");
call addUser("cbcortez3@up.edu.ph", "Clarisse", "Cortez", "hitler19", "ADMIN");
call addUser("lbafable@up.edu.ph", "Lorenz", "Afable", "brucepogi", "MEMBER");
call addUser("margareth@yahoo.com", "Francis Margareth", "Cortez", "melody19", "MEMBER");
call addUser("christian@up.edu.ph", "Christian", "Cortez", "hitler19", "MEMBER");
call addMovieBooking("1", "1", "A1");
call addMovieBooking("2", "2", "A1");
call addFavorite(2, 1);
call addFavorite(1, 2);
call addRequest(3);

