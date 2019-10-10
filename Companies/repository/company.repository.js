var Company = require('../models/company.model');

/**
 * inserts a company to the database.
 * @param {string} displayName - The name of the company.
 * @return {object} the newly inserted object.
 */
function insertCompany(displayName, callback) {
	var company = new Company({
		displayName: displayName,
		name: displayName.toLowerCase(),
	});

	company.save(function (error, doc) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, doc);
		}
	});
}

/**
 * updates a specific company in the database.
 * @param {object} companyDto - (_id: id of the company, displayName: new name of the company).
 * @return {object} the newly patched object.
 */
function updateCompany(companyDto, callback) {
	Company.findOneAndUpdate({ _id: companyDto._id },
		{ $set: { displayName: companyDto.displayName, name: companyDto.displayName.toLowerCase() } }, { new: true },
		function (error, result) {
			if (error) {
				return callback(error);
			} else {
				return callback(result);
			}
		});
}

/**
 * inserts a workspace to a specific company in the database
 * @param {object} workspaceDto - (_id: id of the company, displayName: new name of the workspace).
 * @return {object} the newly added object to the company.
 */
function insertWorkspace(workspaceDto, callback) {
	var workspace = {
		displayName: workspaceDto.displayName,
		name: workspaceDto.displayName.toLowerCase(),
	}


	Company.findOneAndUpdate({ _id: workspaceDto._id, 'workspaces.displayName': { $ne: workspaceDto.displayName } },
		{ $push: { 'workspaces': workspace } }, { new: true },
		function (error, result) {
			if (error) {
				return callback(error);
			}
			if (!result) {
				return callback(new Error('workspace exists.'))
			}
			return callback(null, result);
		});
}

/**
 * updates a specific workspace of a specific company in the database.
 * @param {object} workspaceDto - (id: id of the company, _id: id of the workspace, displayName: new name of the company).
 * @return {object} the newly patched object.
 */
function updateWorkspace(workspaceDto, callback) {
	Company.findOneAndUpdate({ 'workspaces._id': { $eq: workspaceDto._id } },
		{ $set: { 'workspaces.$.displayName': workspaceDto.displayName, 'workspaces.$.name': workspaceDto.displayName.toLowerCase() } }, { new: true },
		function (error, result) {
			if (error) {
				return callback(error);
			} else {
				return callback(null, result);
			}
		});

}

/**
 * inserts a user to a specific workspace to a specific company in the database
 * @param {object} userDto - (companyId: id of the company, workspaceId: id of the workspace, email: user's email, role: enum['admin','basic']).
 * @return {object} the newly added object to the company.
 */
function insertUser(userDto, callback) {
	var user = {
		email: userDto.email,
		role: userDto.role
	}


	Company.findOneAndUpdate({ _id: userDto.companyId, 'workspaces._id': userDto.workspaceId, 'workspaces.users.email': { $ne: userDto.email } },
		{ $push: { 'workspaces.$.users': user } }, { new: true, runValidators: true },
		function (error, result) {
			if (error) {
				return callback(error);
			}
			if (!result) {
				return callback(new Error('user with email ' + user.email + ' exists!'));
			}
			return callback(null, result);
		});
}

/**
 * delets  a user from a specific workspace and from a specific company in the database
 * @param {object} userDto - (companyId: id of the company, workspaceId: id of the workspace, email: user's email).
 * @return {object} the newly updated object.
 */
function deleteUser(userDto, callback) {
	Company.findOneAndUpdate({ _id: userDto.companyId, 'workspaces._id': userDto.workspaceId },
		{ $pull: { 'workspaces.$.users': { email: userDto.email } } }, { new: true, safe: true },
		function (error, result) {
			if (error) {
				return callback(error);
			}
			return callback(null, result);
		});
}


module.exports = {
	insertCompany,
	updateCompany,
	insertWorkspace,
	updateWorkspace,
	insertUser,
	deleteUser
};