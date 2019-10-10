var express = require('express');
var connectDb = require('./models/db');
var companyRouterController = require('./controllers/company.controller');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
if (process.env.NODE_ENV === 'test') {
	dotenv.config({
		path: './.test.env',
	});
} else {
	dotenv.config({
		path: './.env',
	});
}

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(companyRouterController);

app.listen(process.env.PORT, function () {
	console.log('listening to: ' + process.env.PORT);
	connectDb();
});
