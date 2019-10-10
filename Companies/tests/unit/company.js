var dotenv = require('dotenv').config({
  path: './.test.env',
});
var mongoose = require('mongoose');
var assert = require('assert');
//var server = require('../../server');
var Company = require('../../models/company.model');
var dbUri = 'mongodb+srv://' + process.env.databaseUsername + ':'
  + process.env.databasePassword + '@' + process.env.cluster + '/'
  + process.env.databaseName + '?retryWrites=true&w=majority';




describe('unit tests for company', function () {
  beforeEach(function (done) {
    if (mongoose.connection.db) return done();
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(dbUri);
    
    done();
  });

  var company = new Company({
    displayName: 'Taulant',
    name: 'Taulant'.toLowerCase()
  });

  //insert new company
  it('Saves a new company to the database', function (done) {
    company.save(function (err, model) {
      if (err) return done(err);
      Company.findOne({ displayName: company.displayName }, function (err, doc) {
        if (err) return done(err);
        company._id = doc._id;
        assert.equal(doc.displayName, company.displayName);
        done();
      });
    });

  });

  it('Fails to save new company', function (done) {
    company.save(function (err, model) {
      if (err) {
        assert.throws(function () {
          sendMessage(err.message);
        }, Error);
      }
      done();
    });

  });

  var company1 = new Company({
    displayName: 'Taulant2',
    name: 'Taulant2'.toLowerCase()
  });

  //inserts another company
  it('Saves another company to the database', function (done) {
    company1.save(function (err, model) {
      if (err) return done(err);
      Company.find({}, function (err, docs) {
        if (err) return done(err);
        assert(docs.length > 1);
        done();
      });
    });

  });

  it('Updates the company name from Taulant2 to Tnaluat2', function (done) {
    var companyDto = {
      displayName: 'Tnaluat2',
    }
    Company.findOneAndUpdate({ displayName: company1.displayName },
      { $set: { displayName: companyDto.displayName, name: companyDto.displayName.toLowerCase() } }, { new: true }
      , function (err, doc) {
        if (err) {
          return done(err);
        }
        assert.equal(doc.displayName, 'Tnaluat2')
        done();
      });
  });

  it('It adds a workspace to a specific company', function (done) {
    var workspace = {
      _id: company._id,
      displayName: company.displayName,
      name: company.displayName.toLowerCase(),
    }

    Company.findOneAndUpdate({ _id: workspace._id, 'workspaces.displayName': { $ne: workspace.displayName } },
      { $push: { 'workspaces': workspace } }, { new: true },
      function (error, doc) {
        if (error) {
          return done(error);
        }
        company.workspaceId = doc.workspaces[0]._id;
        assert.notEqual(doc, null);
        done();
      });
  });

  it('It should fail adding new workspace', function (done) {
    var workspace = {
      _id: company._id,
      displayName: company.displayName,
      name: company.displayName.toLowerCase(),
    }

    Company.findOneAndUpdate({ _id: workspace._id, 'workspaces.displayName': { $ne: workspace.displayName } },
      { $push: { 'workspaces': workspace } }, { new: true },
      function (error, doc) {
        if (error) {
          return done(error);
        }
        assert.equal(doc, null);
        done();
      });

  });

  it('It adds a user to a specific workspace to a specific company', function (done) {
    var user = {
      email: 'taulantmehmeti@gmail.com',
      role: 'admin'
    }


    Company.findOneAndUpdate({ _id: company._id, 'workspaces._id': company.workspaceId, 'workspaces.users.email': { $ne: user.email } },
      { $push: { 'workspaces.$.users': user } }, { new: true, runValidators: true },
      function (error, doc) {
        if (error) {
          return done(error);
        }
        assert(doc.workspaces[0].users.length > 0);
        done();
      });
  });

  it('It fails to add new user due to email wrong format', function (done) {
    var user = {
      email: 'taulantmehmetigmail.com',
      role: 'admin'
    }


    Company.findOneAndUpdate({ _id: company._id, 'workspaces._id': company.workspaceId, 'workspaces.users.email': { $ne: user.email } },
      { $push: { 'workspaces.$.users': user } }, { new: true, runValidators: true },
      function (error, doc) {
        if (error) {
          assert.throws(function () {
            sendMessage(err.message);
          }, Error);
        }
        done();
      });
  });

  it('It fails to add new user due to wrong role', function (done) {
    var user = {
      email: 'taulant@gmail.com',
      role: 'asd'
    }


    Company.findOneAndUpdate({ _id: company._id, 'workspaces._id': company.workspaceId, 'workspaces.users.email': { $ne: user.email } },
      { $push: { 'workspaces.$.users': user } }, { new: true, runValidators: true },
      function (error, doc) {
        if (error) {
          assert.throws(function () {
            sendMessage(err.message);
          }, Error);
        }
        done();
      });
  });

  it('It fails to add new user due to the user existing', function (done) {
    var user = {
      email: 'taulantmehmeti@gmail.com',
      role: 'asd'
    }

    Company.findOneAndUpdate({ _id: company._id, 'workspaces._id': company.workspaceId, 'workspaces.users.email': { $ne: user.email } },
      { $push: { 'workspaces.$.users': user } }, { new: true, runValidators: true },
      function (error, doc) {
        if (error) {
          assert.throws(function () {
            sendMessage(err.message);
          }, Error);
        }
        done();
      });
  });

  it('It deletes a user from a specific company', function (done) {
    var user = {
      email: 'taulantmehmeti@gmail.com',
    }

    Company.findOneAndUpdate({ _id: company._id, 'workspaces._id': company.workspaceId },
      { $pull: { 'workspaces.$.users': { email: user.email } } }, { new: true, safe: true },
      function (error, doc) {
        if (error) {
          return done(error);
        }
        assert(doc.workspaces[0].users.length == 0);
        done();
      });
  });

  after(function (done) {
    for (var collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].remove(function () { });
    }
    mongoose.disconnect();
     done();

  });
});

