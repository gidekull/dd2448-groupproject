var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');

var sequelize = require('../controllers/sequelizeConfig.js');

var User = sequelize.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [1,30]
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true,
			notEmpty: true,
			len: [1,100]
		}
	},
	password_hashed: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: true,
			//notNull: true
		}
	},
	password: {
		type: Sequelize.VIRTUAL
	},
	password_confirmation: {
		type: Sequelize.VIRTUAL
	}
}, {
	freezeTableName: true,
	indexes: [{unique: true, fields: ['email']}], //Not needed? Control in passport
	classMethods: {
		login: function(user, password, option, callback){
			return bcrypt.compareSync(password, user.password_hashed);
		}
	} // Model tableName will be the same as the model name
});

var passwordRegistrationComparison = function(user, option, callback) {
	if (user.password != user.password_confirmation) {
		return callback(false, {message: "The passwords do not match."});
	} else {
		console.log(user.password);
		bcrypt.hash(user.password, 10, function(err, hash) {
			if (err) {
				console.log(err);
			} else {;
				user.set('password_hashed', hash);
				user.save();
			}
		});
		return callback(null, user, {message: "User registered!"});
	};
};

var passwordUpdateComparison = function(user, option, callback) {
	if (user.password != user.password_confirmation) {
		return callback(false, {message: "The passwords do not match."});
	} else {
		bcrypt.hash(user.attributes.password, 10, function(err, hash) {
			if (err) {
				console.log(err);
			} else {
				console.log(user.attributes.id);
				User.findOne({where: {
					id: user.attributes.id
				}}).then(function(user){
					user.set('password_hashed', hash);
					user.save();
				})
				//user.save();
			}
		});
		return callback(null, user, {message: "Password set"});
	};
};

User.hook('beforeCreate', function(user, option, callback){
	console.log(user.password_confirmation);
	if (user.password) {
		passwordRegistrationComparison(user, option, callback);
		//Fixa så den gör rätt här.
		//return callback(null, {message: "User has been registrered."})
	} else {
		return callback(null, {message: "Password is missing"})
	} 
});

User.hook('beforeBulkUpdate', function(user, option, callback){
	console.log(user.attributes.id);
	if (user.attributes.password) {
		passwordUpdateComparison(user, option, callback);

	} if (user.attributes.email){
		User.findOne({where: {
			id: user.attributes.id
		}}).then(function(user1){
			user1.set('email', user.attributes.email);
			user1.save();
		});
		return callback(true, {message: 'Email is updated'});
	} if (user.attributes.name){
		User.findOne({where: {
			id: user.attributes.id
		}}).then(function(user1){
			//console.log(user);
			user1.set('name', user.attributes.name);
			user1.save();
		});

		//user.set('name', user.name);
		//user.save();
	} 
});

//User.hook('beforeUpdate', function(user, opt))

User.sync();

module.exports = User;