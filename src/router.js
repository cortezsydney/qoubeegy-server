const express = require('express');
const Ctrl = require('./entities/signup/controller');
const ctrlMovie = require('./entities/movie/controller');
const ctrlSignIn = require('./entities/signIn/controller');
const ctrlBooking = require('./entities/booking/controller');
const ctrlProfile = require('./entities/profile/controller');
const ctrlAdmin = require('./entities/admin/movie/controller');
const router = new express.Router();

router.post('/member/add',  Ctrl.addMember);
router.post('/signin', ctrlSignIn.signInUser);
router.post('/signout', ctrlSignIn.signOutUser);
router.get('/movies/details/:Title', ctrlMovie.viewMovie);
router.get('/all/movies', ctrlMovie.viewMovies);
router.get('/all/movies/schedules', ctrlMovie.viewMovieShowingSchedules);
router.get('/all/movies/bookings', ctrlMovie.viewMovieBookings);
router.get('/movies/houses/title/:Title', ctrlMovie.viewHouseByTitle);
router.get('/movies/showings/place/:Place', ctrlMovie.viewShowingByPlace);
router.get('/movies/showings/title/:Title', ctrlMovie.viewShowingByTitle);
router.post('/movies/showings/place/title', ctrlMovie.viewShowingByPlaceAndTitle);
/* Added Features */
router.put('/profile/edit', ctrlProfile.editUser);
router.post('/profile/apply', ctrlProfile.sendRequest);
router.put('/profile/apply/approve', ctrlProfile.approveRequest);
router.put('/profile/apply/reject', ctrlProfile.rejectRequest);

router.post('/movie/add', ctrlAdmin.addMovie); //
router.delete('/profile/delete', ctrlProfile.deleteUser); //
router.delete('/booking/delete', ctrlBooking.deleteBooking); //
/* End of Added Features */
router.post('/booking/add', ctrlBooking.addBooking);
router.get('/booking/all', ctrlBooking.viewBookings);


router.get('/all/movies/houses', ctrlMovie.viewMovieHouses); //












//movie get like tags DONE
//return all attributes of user at session
//moviebookings by ID DONE
//moviehouses by movieTitle DONE



module.exports = router;



//change all db adding end dates
//and when to book
//per user