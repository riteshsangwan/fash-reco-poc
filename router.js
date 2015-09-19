'use strict';

/**
 * Router logic, this class will implement all the API routes login
 * i.e, mapping the routes to controller and add auth middleware if any route is secure.
 *
 * @author      ritesh
 * @version     1.0.0
 */

var express = require('express');
var userController = require('./controllers/UserController');
var countryController = require('./controllers/CountryController');
var config = require('config');
var auth = require('./middlewares/Auth');
var middleware = auth(config.JWT_SECRET);

module.exports = function() {
  var options = {
    caseSensitive: true
  };

  // Instantiate an isolated express Router instance
  var router = express.Router(options);
  // users
  router.post('/users', userController.register);
  router.post('/users/login', userController.login);
  router.post('/users/forgotPassword', userController.forgotPassword);

  router.post('/users/updatePassword', middleware, userController.updatePassword);
  router.post('/users/updateProfile', middleware, userController.updateProfile);
  router.get('/me', middleware, userController.me);
  router.get('/countries', countryController.getAll);
  router.post('/resetForgottonPassword', userController.resetForgottonPassword);
  router.get('/verifyAccount', userController.verifyAccount);
  return router;
};