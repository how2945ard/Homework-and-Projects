module.exports = function(app, socket) {

  var settings = require('../settings');
  var mongodURL = settings.mongoUrl;

  var mongojs = require("mongojs");

  var db = mongojs(mongodURL, ['news']);

  var io = require('socket.io')(socket);
  /*----- index page -----*/
  app.get('/', function(req, res) {
    return res.render('index');
  });

  app.get('/api/poke', function(req, res) {
    io.emit('clickEvent', 'clickEvent');
    return res.json({
      click: 'clickEvent'
    });
  });

  app.get('/api/move', function(req, res) {
    io.emit('move', 'move');
    return res.json({
      move: 'move'
    });
  });

  app.get('/api/news', function(req, res) {
    var news = db.collection('news');
    news.findOne({}, function(err, data) {
      res.render('news', {news: data});
    });
  });
};