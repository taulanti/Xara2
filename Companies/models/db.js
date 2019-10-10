var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

function connectDb() {
	mongoose.connect('mongodb+srv://'+process.env.databaseUsername+':'
	+process.env.databasePassword+'@'+process.env.cluster+'/'
	+process.env.databaseName+'?retryWrites=true&w=majority', function (error) {
		if (error) {
			console.log('MongoDb connection error: ' + error);
		} else {   
      console.log('MongoDb connection succeeded.');
      console.log('environment: '+process.env.NODE_ENV);
      console.log('database: '+process.env.databaseName);
		}
	});
}

module.exports = connectDb;

