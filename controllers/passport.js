var passport = require('passport');
var User = require('../models/user.js');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
	
passport.serializeUser(function(user, done) {
	console.log(user.id);
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id).then(function(user){ 
		done(null,user);
	}).catch(function(err){
		done(err, user);
	});

});

passport.use('signup', new LocalStrategy({
	usernameField: 'name',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, name, password, done){
	console.log(req.body);
	User.findOne({where: {'email': req.body.email}}).then(function(user){
		console.log(req.body);
		//console.log(user.dataValues);
		if (user){
			return done(null, false, {message: 'Email is unavailable.'});
		} else {
			User.findOne({where: {'name': name}}).then(function(user1){
				if (user1){
				return done(null, false, {message: 'Name is unavailable.'});
				} else {
					var newUser = User.create({
					name: name, email: req.body.email,
					password: password, password_confirmation: req.body.password_confirmation
			});
				}
			}).catch(function(err){
				if (err){
					console.log(err);
					return done(err);
				}
			})
			//console.log(req.body);
			

		}
	}).catch(function(err){
		if (err){
			console.log(err);
			return done(err);
		}
	});
}));

passport.use('signin', new LocalStrategy({
	usernameField: 'name',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, name, password, done){
	User.findOne({where: {
		email: name
	}
	}).then(function(user){
		if (user){
			if (User.login(user, password)){
				console.log("A user has signed in!");
				return done(null, user);
			} else {
				console.log("A user has been rejected");
				return done(false);
			}
		} else {
			console.log("A user that does not exist tried to log in");
			return done(false)
		}
	}).catch(function(err){
		console.log(err);
		return done(err);
	})
}));

passport.use(new FacebookStrategy({
    clientID: 423681404675552,
    clientSecret: f7a8e6862f5ea72c6ec535262f97a23d,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));