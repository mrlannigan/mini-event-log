
exports.checkLogin = function(req, res, next) {
	if (!req.session.email || !req.session.isLoggedIn) {
		res.redirect('/login');
	}
	next();
}