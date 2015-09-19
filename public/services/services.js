'use strict';
/**
 * Angularjs services
 *
 * @author      ritesh
 * @version     1.0.0
 */

var appServices = angular.module('fashRecoApp.services', []);

/**
 * Application configuration.
 * Application configuration is exposed to the controllers as well as dependent services in the form of a config service
 * Any controller or service needs to access global configuration must inject this service.
 * Use standard angular injection
 */
appServices.factory('config', [function() {
  return {
    userRoles: {
      HAIR_STYLIST: 'HAIR_STYLIST',
      BUSINESS_OWNER: 'BUSINESS_OWNER',
      INDIVIDUAL_USER: 'INDIVIDUAL_USER'
    },
    publicRoutes: [
      '/register'
    ]
  };
}]);

/**
 * Angular service that abstracts the sessionToken storage and retrieval
 */
appServices.factory('storage', [function() {
  var service = {rememberMe: false};
  /**
   * Returns the stored sessionToken
   * This method first checks in sessionStorage if sessionToken is not found in sessionStorage
   * this method checks in localStorage, if sessionToken still not found in localStorage, then it will return null or undefined
   * The controllers has to implement the logic that if sessionToken is null/undefined then user is not authorized
   */
  service.getSessionToken = function() {
    var token = sessionStorage.getItem('fashreco.application.auth.token');
    if (!token) {
      token = localStorage.getItem('fashreco.application.auth.token');
    }
    return token;
  };
  /**
   * Store the session token in sessionStorage
   * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
   */
  service.storeSessionToken = function(sessionToken, flag) {
    service.rememberMe = flag;
    sessionStorage.setItem('fashreco.application.auth.token', sessionToken);
    if (flag) {
      localStorage.setItem('fashreco.application.auth.token', sessionToken);
    }
  };

  /**
   * Get current user profile stored in sessionStorage or localStorage
   */
  service.getCurrentUserProfile = function() {
    var profile = sessionStorage.getItem('fashreco.application.auth.profile');
    if (!profile) {
      profile = localStorage.getItem('fashreco.application.auth.profile');
    }
    return angular.fromJson(profile);
  };

  /**
   * Store the current user profile in sessionStorage
   * A boolean flag is passed which when true indicate that user chose remember me option and data should also be stored in localStorage
   */
  service.storeCurrentUserProfile = function(profile) {
    var flag = service.rememberMe;
    profile = angular.toJson(profile);
    sessionStorage.setItem('fashreco.application.auth.profile', profile);
    if (flag) {
      localStorage.setItem('fashreco.application.auth.profile', profile);
    }
  };

  /**
   * Utility method to clear the sessionStorage
   */
  service.clear = function() {
    sessionStorage.removeItem('fashreco.application.auth.token');
    sessionStorage.removeItem('fashreco.application.auth.profile');

    localStorage.removeItem('fashreco.application.auth.token');
    localStorage.removeItem('fashreco.application.auth.profile');
  };
  return service;
}]);


/**
 * Application utility service
 */
appServices.factory('util', ['$log', 'storage', function($log, storage) {
  var service = {};

  /**
   * Function to check if any user is currently logged in
   */
  service.isLoggedIn = function() {
    var profile = storage.getCurrentUserProfile();
    var sessionToken = storage.getSessionToken();
    if (profile && sessionToken) {
      return true;
    }
    return false;
  };

  return service;
}]);

/**
 * Application SecurityService.
 * This service is responsible for all the application security.
 * All the methods in this service returns a promise.
 * When async opeartion finishes that promise would be resolved or rejected.
 * The promise would be resolved with actual response from Backend API and would be rejected be the reason
 */
appServices.factory('SecurityService', ['config', '$log', 'storage', '$http', '$q', function(config, $log, storage, $http, $q) {
  var service = {};
  /**
   * Authenticate the user using password type.
   */
  service.authenticate = function(credentials, rememberMe) {
    var deferred = $q.defer();
    // prepare http request object
    var req = {
      method: 'POST',
      url: '/users/login',
      data: credentials
    };
    $http(req).then(function(payload) {
      storage.storeSessionToken(payload.data.token, rememberMe);
      deferred.resolve(payload.data);
    }, function(reason) {
      $log.error('Error authenticating user', reason);
      deferred.reject(reason);
    });
    return deferred.promise;
  };

  return service;
}]);

/**
 * Application UserService.
 * This service exposes user actions like register me etc
 * All the methods in this service returns a promise.
 * When async opeartion finishes that promise would be resolved or rejected.
 * The promise would be resolved with actual response from Backend API and would be rejected be the reason
 */
appServices.factory('UserService', ['config', '$log', 'storage', '$http', '$q', function(config, $log, storage, $http, $q) {
  var service = {};

  /**
   * Register the user on mom and pop platform
   * registration is registration entity object which would be converted to json string
   * userProfile and businessProfile are optional
   */
  service.register = function(registration) {
    var deferred = $q.defer();
    // prepare request object
    var req = {
      method: 'POST',
      url: '/users',
      data: registration
    };
    $http(req).then(function(payload) {
      deferred.resolve(payload.data);
    }, function(reason) {
      $log.error('Error registering user', reason);
      deferred.reject(reason);
    });
    return deferred.promise;
  };

  /**
   * Get user profile uniquely identified by id
   */
  service.me = function(id) {
    var deferred = $q.defer();
    var accessToken = storage.getSessionToken();
    // prepare http request object
    var req = {
      method: 'GET',
      url: '/me',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    };
    $http(req).then(function(payload) {
      storage.storeCurrentUserProfile(payload.data);
      deferred.resolve(payload.data);
    }, function(reason) {
      deferred.reject(reason);
    });
    return deferred.promise;
  };

  return service;
}]);