"use strict"; 

var express = require('express');
var passport = require('passport');
var router = express.Router();
var csrf = require('csurf');

var Fbuser = require("../models/fbuser.js");

//var csrf_init = csrf();
//router.use(csrf_init);


// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile',
                                      failureRedirect: '/signin' }));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

router.post('/signin', function(req, res, next){
	res.redirect('/auth/facebook');
});

router.get('/profile', authenticated, function(req, res, next) {
  res.render('profile', {name: req.user.name});
});

module.exports = router;

function authenticated(req, res, next){
	if (req.isAuthenticated()){
		next();
	} else {
		res.sendStatus(401);
	}
};