const express = require('express');
const router = new express.Router();
const db = require('./database/index');


const SignUpRepo = require('./entities/signUp/repo')(db);
const ctrlSignUp = require('./entities/signUp/controller')(SignUpRepo);
router.post('/member/add',  ctrlSignUp.addMember);

const repoSignIn = require('./entities/signIn/repo')(db);
const ctrlSignIn = require('./entities/signIn/controller')(repoSignIn);
router.post('/signin', ctrlSignIn.signIn);
router.post('/signout', ctrlSignIn.signOut);

const repoProfile = require('./entities/profile/repo')(db);
const ctrlProfile = require('./entities/profile/controller')(repoProfile);
router.put('/profile/edit', ctrlProfile.editUser)
router.post('/profile/apply', ctrlProfile.sendRequest)
router.delete('/profile/apply/approve/:UserId', ctrlProfile.approveRequest)
router.delete('/profile/apply/reject/:UserId', ctrlProfile.rejectRequest)
router.post('/favorite/add', ctrlProfile.addFavorite);
router.delete('/favorite/delete/:FavoriteId', ctrlProfile.deleteFavorite);
router.get('/view/favorite', ctrlProfile.viewFavorite);
router.get('/get-session', ctrlProfile.getSession);

const repoMovie = require('./entities/movie/repo')(db);
const ctrlMovie = require('./entities/movie/controller')(repoMovie);
router.get('/movies/details/:Title', ctrlMovie.viewMovie);
router.get('/all/movies', ctrlMovie.viewMovies);
router.get('/all/movies/schedules', ctrlMovie.viewMovieShowingSchedules);
router.get('/all/movies/houses', ctrlMovie.viewMovieHouses);
router.get('/movies/houses/title/:Title', ctrlMovie.viewHouseByTitle);
router.get('/movies/showings/place/:Place', ctrlMovie.viewShowingByPlace);
router.get('/movies/showings/title/:Title', ctrlMovie.viewShowingByTitle);
router.post('/movies/showings/place/title', ctrlMovie.viewShowingByPlaceAndTitle);
router.get('/movies-distinct', ctrlMovie.viewDistinctMovies);
router.get('/movies-distinct/by-title/:Title', ctrlMovie.viewDistinctMoviesByTitle);

const repoBooking = require('./entities/booking/repo')(db);
const ctrlBooking = require('./entities/booking/controller')(repoBooking);
router.post('/booking/add', ctrlBooking.addBooking);
router.get('/booking/all', ctrlBooking.viewBookings);
router.delete('/booking/delete/:MovieBookingId', ctrlBooking.deleteBooking);
router.post('/booking/all/seats', ctrlBooking.getSeats);

const repoAdminBooking = require('./entities/admin/booking/repo')(db);
const ctrlAdminBooking = require('./entities/admin/booking/controller')(repoAdminBooking);
router.delete('/booking/delete/user/:MovieBookingId', ctrlAdminBooking.deleteBooking);
router.get('/all/movies/bookings', ctrlAdminBooking.viewMovieBookings);
router.get('/all/movies/bookings/:UserId', ctrlAdminBooking.viewEachBooking);

const repoAdminMovie = require('./entities/admin/movie/repo')(db);
const ctrlAdminMovie = require('./entities/admin/movie/controller')(repoAdminMovie);
router.post('/showing/add', ctrlAdminMovie.addShowing);
router.post('/movie/add', ctrlAdminMovie.addMovie);
router.delete('/all/movies/schedules/:MovieShowingId', ctrlAdminMovie.deleteShowing);

const repoAdminUser = require('./entities/admin/users/repo')(db);
const ctrlAdminUser = require('./entities/admin/users/controller')(repoAdminUser);
router.get('/all/users', ctrlAdminUser.viewUsers);
router.get('/all/request', ctrlAdminUser.viewRequest);
router.get('/all/view/favorite/:UserId', ctrlAdminUser.viewEachFavorite);
router.delete('/all/users/delete/:UserId', ctrlAdminUser.deleteUser)

// router.delete('/profile/delete', ctrlProfile.deleteUser);

module.exports = router;