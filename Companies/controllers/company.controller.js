var express = require('express');
var router = express.Router();
var repository = require('../repository/company.repository');


router.post('/companies', function (req, res) {
	repository.insertCompany(req.body.displayName, function (error, result) {
		if (error) { res.status(500).send(error); }
		else { res.status(201).send(result); }
	});
});

router.patch('/companies/:_id', function (req, res) {
	var dto = {
		_id: req.params._id,
		displayName: req.body.displayName
	};

	repository.updateCompany(dto, function (error, result) {
		if (error) { res.status(500).send(error); }
		else { res.status(200).send(result); }
	});
});

router.post('/companies/:_id/workspaces', function (req, res) {
	var dto = {
		_id: req.params._id,
		displayName: req.body.displayName
	};
	repository.insertWorkspace(dto, function (error, result) {

		if (error) res.status(500).send(error.message);
		else
			res.status(201).send(result);
	});
});

router.patch('/companies/:id/workspaces/:_id', function (req, res) {
	var dto = {
		id: req.params.id,
		_id: req.params._id,
		displayName: req.body.displayName,
	};
	repository.updateWorkspace(dto, function (error, result) {
		if (error) res.status(500).send(error.message);
		else
			res.status(201).send(result);
	});
});

router.post('/companies/:id/workspaces/:_id/users', function (req, res) {
	var dto = {
		companyId: req.params.id,
		workspaceId: req.params._id,
		email: req.body.email,
		role: req.body.role
	};
	repository.insertUser(dto, function (error, result) {
		if (error) res.status(500).send(error.message);
		else
			res.status(201).send(result);
	});
});

router.delete('/companies/:id/workspaces/:_id/users/:email', function (req, res) {
	var dto = {
		companyId: req.params.id,
		workspaceId: req.params._id,
		email: req.params.email,
	};
	repository.deleteUser(dto, function (error, result) {
		if (error) res.status(500).send(error.message);
		else
			res.status(201).send(result);
	});
})


module.exports = router;
