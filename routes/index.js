
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserUtilities = require('../utilities/user');


/**
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Mini Event Log' });
};

/**
 * GET login
 */

exports.login = function(req, res) {
  res.render('login', {
    title: 'Login - Mini Event Log',
    flashMessage: req.session.flashMessage || req.flashMessage || '',
    email: req.session.email || ''
  });

  if (req.session.flashMessage) delete req.session.flashMessage;
}

/**
 * POST login
 * validate login
 */

exports.doLogin = function(req, res) {

  req.session.isLoggedIn = false;

  var returnBad = function (msg) {
    req.session.flashMessage = msg || '';
    res.redirect('/login');
    return false;
  }

  var timeout = setTimeout(function () {
    returnBad('Login timed out, please try again.');
  }, 20000);

  UserUtilities.checkCreds(req, function (err, result) {
    clearTimeout(timeout);

    if (err) {
      req.session.flashMessage = err.toString();
      res.redirect('/login');
      return;
    }

    res.redirect('/');
    return;
  });

}

/**
 * GET logout
 */

exports.logout = function(req, res) {
  req.session.isLoggedIn = false;
  req.session.flashMessage = 'Logged out';
  res.redirect('/login');
}