var Sequelize = require('sequelize');
var sequelize = require('../controllers/sequelizeConfig.js');

var Session = sequelize.define('Session', {
	sid: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	uId: {
		type: Sequelize.INTEGER,
		//allowNull: false
	},
	expires: {
		type: Sequelize.DATE,
	},
	data: {
		type: Sequelize.STRING(50000),
	},
}, {
	freezeTableName: true
});



/*exports.extendDefaultFields = function(defaults, session) {
	console.log(session);
	console.log(session.passport);
	return {
    	data: defaults.data,
    	expires: defaults.expires,
    	uId: session.passport.user
	};
}*/

Session.sync();

module.exports = Session;