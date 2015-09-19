'use strict';
/* jshint camelcase: false */
/**
 * Start the pm2 cluster using the pm2 api
 *
 * @author      ritesh
 * @version     1.0.0
 */

var pm2 = require('pm2');
var winston = require('winston');

var instances = require('os').cpus().length;
var maxMemory = process.env.WEB_MEMORY || 512;

pm2.connect(function() {
  pm2.start({
    script    : 'server.js',
    name      : 'fashreco-poc',
    exec_mode : 'cluster',
    merge_logs: true,
    instances : instances,
    max_memory_restart : maxMemory + 'M',
    env: {
      'NODE_ENV': 'production'
    },
  }, function(err) {
    if(err) {
      return winston.error('Error while launching applications', err);
    }
    winston.info('PM2 and application has been succesfully started');

    // Display logs in standard output
    pm2.launchBus(function(err, bus) {
      winston.info('[PM2] Log streaming started');

      bus.on('log:out', function(packet) {
       winston.info('[App:%s] %s', packet.process.name, packet.data);
      });

      bus.on('log:err', function(packet) {
        winston.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });
    process.exit(0);
  });
});