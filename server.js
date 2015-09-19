'use strict';

/**
 * Main application init file.
 * This will spin up an HTTP SERVER which will listen on connections on default configured port
 *
 * @author      ritesh
 * @version     1.0.0
 */

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  router = require('./router'),
  logger = require('winston'),
  responseTransformer = require('./middlewares/ResponseTransformer'),
  errorHandler = require('./middlewares/ErrorHandler'),
  path = require('path'),
  subscribers = require('./subscribers'),
  queues = require('./queues'),
  responser = require('./middlewares/Responser'),
  config = require('config');

var port = process.env.PORT || config.WEB_SERVER_PORT || 3100;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(router());
app.use(responseTransformer());
app.use(responser());
app.use(errorHandler());
/**
 * Configuring root path
 */
app.get('/', function(req, res) {
  res.render('index', {
    title : 'FashReco - A new way to get groomed'
  });
});
// initialize the pub/sub queues
queues.init(function() {
  subscribers.registerAll();
  app.listen(port, function() {
    logger.info('Application started successfully', {name: config.NAME, port: port});
  });
});