var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Store = require('connect-session-sequelize')(session.Store);


//Added
var passport = require('passport');
var Sequelize = require('sequelize');
var sequelize = require('./controllers/sequelizeConfig.js');
var router = require('./controllers/controllers.js');
var Sessions = require("./models/sessions.js")

require('./controllers/passport.js');

function extendDefaultFields(defaults, session) {
	return {
    	data: defaults.data,
    	expires: defaults.expires,
    	uId: session.passport.user
	};
}

var store = new Store({
    db: sequelize,
    table: 'Session',
  	extendDefaultFields: extendDefaultFields,
  });


var expressSession = session({secret: 'Riktigtbrasäkerhetsomingenkangissaförjagharsåhimlalångnyckel:Dobsskämt', 
	resave: true, 
	saveUninitialized: false,
	secure: true, 
	store: store,
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());



app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
