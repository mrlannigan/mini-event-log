
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , user = require('./utilities/user')
  , mongoose = require('mongoose')
  , winston = require('winston');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('mongouri', process.env.MONGOLAB_URI || 'mongodb://localhost/minieventlog');

  app.use(express.favicon());
  app.use(express.logger({
    format: 'dev',
    stream: {
      write: function(str){
        app.logger.info(str.substr(0, str.length - 1));
      }
    }
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(process.env.COOKIE_SECRET || 'your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({timestamp: true})
  ]
});

var checkMaintenanceMode = function(req, res, next) {
  if (app.get('databaseConnected')) {
    return next();
  } else {
    res.render('maintenance', {reason: 'DB is not connected', title: 'Mini Log Title - Maintenance'});
  }
}

app.get('/', checkMaintenanceMode, user.checkLogin, routes.index);
app.get('/login', checkMaintenanceMode, routes.login);
app.post('/login', checkMaintenanceMode, routes.doLogin);
app.get('/logout', checkMaintenanceMode, routes.logout);

mongoose.connect(app.get('mongouri'));

http.createServer(app).listen(app.get('port'), function(){
  app.logger.info("Server listening on port " + app.get('port'));
});

mongoose.connection.on('open', function(e) {
  app.set('databaseConnected', true);
  app.logger.info('Database connected.');
});

mongoose.connection.on('error', function(e) {
  app.set('databaseConnected', false);
  app.logger.error('DB:', e.toString());
});