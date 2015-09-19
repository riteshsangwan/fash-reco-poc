/* jshint unused: false */
'use strict';

/**
 * subscribers.js
 * Registers all subscribers for all the queues
 *
 * @author      ritesh
 * @version     1.0.0
 */

var winston = require('winston'),
  errors = require('common-errors'),
  async = require('async');
var queues = require('./queues'),
  queueNames = queues.names;


/**
 * Listener for any messages on 'forgotpassword' queue.
 * This method will send the forgot password email to the user
 *
 * @param   {Object}      message         message that is published
 */
var _forgotPasswordHandler = function(message) {

};

/**
 * Listener for any messages on 'registeruser' queue.
 * This method will send the user registration email
 *
 * @param   {Object}      message         message that is published
 */
var _registerUserHandler = function(message) {

};

/**
 * Registers all the subscribers for all the queues.
 * These subscribers will listen for messages that are published on the queue and do some operation
 */
exports.registerAll = function() {
  queues.subscribe(queueNames.forgotpassword, _forgotPasswordHandler);
  queues.subscribe(queueNames.registeruser, _registerUserHandler);
};