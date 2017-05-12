var passport = require('passport');
var Fbuser = require('../models/Fbuser.js');
//var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
	
passport.serializeUser(function(user, done) {
	console.log(user.id)
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	Fbuser.findById(id).then(function(user){ 
		done(null,user);
	}).catch(function(err){
		done(err, user);
	});
});

passport.use('facebook', new FacebookStrategy({
    clientID: 423681404675552,
    clientSecret: "f7a8e6862f5ea72c6ec535262f97a23d",
    callbackURL: "https://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    Fbuser.findOne({where: {'id': profile.id}}).then(function(user) {
		if (user){
      		return done(null, user);
     	} else {
      	Fbuser.create({
			id: profile.id, name: profile.displayName
		}).then(function(){
			Fbuser.findOne({where: {'id': profile.id}}).then(function(user) {
				return done(null, user);
			})
		});
      }
    }).catch(function(err){
		if (err){
			console.log(err);
			return done(err);
		}
	});
  }
));