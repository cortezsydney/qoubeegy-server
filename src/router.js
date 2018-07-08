const express = require('express');
const ctrlSignUp = require('./entities/signup/controller');
const ctrlMovie = require('./entities/movie/controller');
const ctrlSignIn = require('./entities/signIn/controller');
const ctrlBooking = require('./entities/booking/controller');
const ctrlProfile = require('./entities/profile/controller');
const ctrlAdminMovie = require('./entities/admin/movie/controller');
const ctrlAdminBooking = require('./entities/admin/booking/controller');
const ctrlAdminUser = require('./entities/admin/users/controller');
const router = new express.Router();

router.get('/get-session', ctrlProfile.getSession);
router.post('/member/add',  ctrlSignUp.addMember);
router.post('/signin', ctrlSignIn.signInUser);
router.post('/signout', ctrlSignIn.signOutUser);
router.get('/movies/details/:Title', ctrlMovie.viewMovie);
router.get('/all/movies', ctrlMovie.viewMovies);
router.get('/all/movie-houses', ctrlMovie.viewMovieHouses);
router.get('/all/movies/schedules', ctrlMovie.viewMovieShowingSchedules);
router.get('/movies/houses/title/:Title', ctrlMovie.viewHouseByTitle);
router.get('/movies/showings/place/:Place', ctrlMovie.viewShowingByPlace);
router.get('/movies/showings/title/:Title', ctrlMovie.viewShowingByTitle);
router.post('/movies/showings/place/title', ctrlMovie.viewShowingByPlaceAndTitle);
router.get('/movies-distinct', ctrlMovie.viewDistinctMovies);
router.get('/movies-distinct/by-title/:Title', ctrlMovie.viewDistinctMoviesByTitle);
/* Added Features */
router.put('/profile/edit', ctrlProfile.editUser);
router.post('/profile/apply', ctrlProfile.sendRequest);
router.get('/all/request', ctrlAdminUser.viewRequest);
router.delete('/profile/apply/approve/:UserId', ctrlProfile.approveRequest);
router.get('/all/movies/bookings/:UserId', ctrlAdminBooking.viewEachBooking);
router.delete('/profile/apply/reject/:UserId', ctrlProfile.rejectRequest);
router.get('/all/movies/bookings', ctrlAdminBooking.viewMovieBookings);
router.get('/all/users', ctrlAdminUser.viewUsers);
router.post('/movie/add', ctrlAdminMovie.addMovie); 
router.post('/showing/add', ctrlAdminMovie.addShowing); 
router.post('/favorite/add', ctrlProfile.addFavorite); 
router.delete('/favorite/delete/:FavoriteId', ctrlProfile.deleteFavorite);
router.get('/view/favorite', ctrlProfile.viewFavorite);
router.get('/all/view/favorite/:UserId', ctrlAdminUser.viewEachFavorite);
router.delete('/movie/delete', ctrlAdminMovie.deleteMovie);
router.delete('/profile/delete', ctrlProfile.deleteUser); 
router.delete('/booking/delete/:MovieBookingId', ctrlBooking.deleteBooking);
router.delete('/booking/delete/user/:MovieBookingId', ctrlAdminBooking.deleteBooking);
router.delete('/all/movies/schedules/:MovieShowingId', ctrlAdminMovie.deleteShowing);
//router.get('/all/request', ctrlAdminUser.viewRequests);
/* End of Added Features */
router.post('/booking/add', ctrlBooking.addBooking);
router.get('/booking/all', ctrlBooking.viewBookings);


router.delete('/all/users/delete/:UserId', ctrlAdminUser.deleteUser)



router.get('/all/movies/houses', ctrlMovie.viewMovieHouses); 












//movie get like tags DONE
//return all attributes of user at session
//moviebookings by ID DONE
//moviehouses by movieTitle DONE



module.exports = router;