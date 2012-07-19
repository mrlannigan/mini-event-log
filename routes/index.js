
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
		flashMessage: ''
	});
}

/**
 * POST login
 * validate login
 */

exports.doLogin = function(req, res) {
	res.redirect('/login');
}

/**
 * GET logout
 */

exports.logout = function(req, res) {
	req.session.isLoggedIn = false;
	res.redirect('/login');
}