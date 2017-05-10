var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');

var sequelize = require('../controllers/sequelizeConfig.js');

var Fbuser = sequelize.define('fbuser', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: true,
	},
}, {
	freezeTableName: true,
	indexes: [{unique: true, fields: ['email']}], //Not needed? Control in passport
	classMethods: {
		login: function(user, password, option, callback){
			return bcrypt.compareSync(password, user.password_hashed);
		}
	} 
});

Fbuser.sync();

module.exports = Fbuser;