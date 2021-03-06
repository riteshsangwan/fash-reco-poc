'use strict';

/**
 * Represent a user in the system
 *
 * @author      ritesh
 * @version     1.0.0
 */

/**
 * NOTE:
 *
 * The country is of map data type which is essentially a nested object
 * Use the following npm module for country data
 * https://github.com/OpenBookPrices/country-data
 * version 1.0.0 doesn't support login using social network
 *
 * timestamp values uses unix timestamp format (no of milliseconds passed since unix epoch)
 */

var mongoose = require('../datasource').getMongoose(),
  timestamps = require('mongoose-timestamp'),
  constants = require('../constants'),
  _ = require('lodash'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  type: {type: String, required: true, enum: _.values(constants.userTypes)},
  // for future reference
  socialNetwork: {type: String, required: false, enum: _.values(constants.socialNetworks)},
  mobileNumber: {type: String, required: true},
  country: {type: Schema.Types.Mixed, required: true},
  resetPasswordToken: {type: String, required: false},
  verifyAccountToken: {type: String, required: false},
  resetPasswordTokenExpiry: {type: Date, required: false},
  verifyAccountTokenExpiry: {type: Date, required: false}
});
// add timestamp plugin
UserSchema.plugin(timestamps);

// module exports
module.exports = {
  UserSchema: UserSchema
};