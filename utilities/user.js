
var mongoose = require('mongoose'),
  UserModel = require('../models/user').get();

exports.checkLogin = function (req, res, next) {
  if (!req.session.email || !req.session.isLoggedIn) {
    res.redirect('/login');
  }
  next();
}

exports.checkCreds = function (req, callback) {
  var self = this;

  if (
    !req.body.email ||
    !req.body.password ||
    req.body.email.length < 5 ||
    req.body.password.length < 1
  ) {
    callback.call(self, new Error('Bad login'));
    return false;
  }

  req.session.email = req.body.email;
  req.body.password = require('crypto').createHash('md5').update(req.body.password).digest('hex');

  UserModel
    .find({
      email: req.body.email,
      password: req.body.password
    })
    .exec(function (err, result) {
      if (err) return callback.call(self, err);

      if (result.length === 0) {
        return callback.call(self, new Error('Bad login'));
      }

      if (result[0]) {
        req.session.isLoggedIn = true;
        req.session.name = result[0].name;
        req.session.email = result[0].email;
        req.session.role = result[0].role;
        return callback.call(self, null, result);
      } else {
        return callback.call(self, new Error('Unknown error'));
      }
    })

}