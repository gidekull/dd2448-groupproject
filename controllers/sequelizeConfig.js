var Sequelize = require('sequelize');
//var sequelize = CONFIG.database;
var bcrypt = require('bcrypt'); //add to package

sequelize = new Sequelize('gidekull', 'gidekull_admin', 'tTFleDGP', {
  host: 'mysql-2017.csc.kth.se',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection to database has been established successfully.');
  }, function (err) { 
    console.log('Unable to connect to the database:', err);
  });

module.exports = sequelize;