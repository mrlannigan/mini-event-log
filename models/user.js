
var mongoose = require('mongoose');

var User = new mongoose.Schema({
  'email': String,
  'name': String,
  'role': String,
  'password': String
});

exports.get = function () {
  return mongoose.model('users', User);
}

exports.getSchema = function () {
  return User;
}