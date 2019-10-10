var mongoose = require('mongoose');
var uuid = require('uuid');


var userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'email can\'t be empty'],
		match: [/\S+@\S+\.\S+/, 'email is invalid'],
		sparse: true
	},
	role: {
		type: String,
		enum: ['admin', 'basic']
	}
});



var workspaceSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuid.v1,
		index: true
	},
	displayName: {
		type: String,
		required: [true, 'displayName can\'t be empty']
	},
	name: {
		type: String,
		lowercase: true,
		sparse: true
	},
	users: {
		type: [userSchema]
	}
});


var companySchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuid.v1
	},
	displayName: {
		type: String,
		required: true
	},
	name: {
		type: String,
		index: { unique: true }
	},
	workspaces: {
		type: [workspaceSchema],
	}

});


module.exports = mongoose.model('Company', companySchema);