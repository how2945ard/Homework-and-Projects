/**
 * Module dependencies.
 */
exports.server = function() {
  var express = require('express');
  var http = require('http');
  var path = require('path');
  var Promise = require('bluebird');
  var settings = require('./settings');
  var app = express();
  var ejsLocals = require('ejs-locals-vadorequest');
  var routes = require('./routes');

  app.configure(function() {

    app.use(express.cookieParser(settings.cookieSecret));
    // development only
    if ('development' === app.get('env')) {
      app.use(express.errorHandler());
    }
    app.set('port', settings.port || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.engine('ejs', ejsLocals);
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

    app.use(function(err, req, res, next) {
      console.log(err.stack);
      res.status(500).send('Something broken!');
    });

    app.use(express.static(path.join(__dirname, 'public')));
  });
  // all environments

  var socket = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
  routes(app,socket);
};