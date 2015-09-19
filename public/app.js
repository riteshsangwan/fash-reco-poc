'use strict';

/**
 * This is the main file. This will bootstrapped the HQ angular app and will do the required configurations
 *
 * @author      ritesh
 * @version     1.0.0
 */
var app = angular.module('fashRecoApp', ['ui.router', 'fashRecoApp.controllers', 'fashRecoApp.services', 'cgNotify']);

/**
 * App configurations goes here
 */
app.config(['$stateProvider', '$urlRouterProvider', '$compileProvider', function($stateProvider, $urlRouterProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'partials/landing.html',
      controller: 'LandingController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'LoginController'
    })
    .state('businessowner', {
      url: '/businessowner',
      templateUrl: 'partials/business-owner.html',
      controller: 'BusinessOwnerController'
    })
    .state('hairstylist', {
      url: '/hairstylist',
      templateUrl: 'partials/hair-stylist.html',
      controller: 'HairStylistController'
    })
    .state('user', {
      url: '/user',
      templateUrl: 'partials/user.html',
      controller: 'UserController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register.html',
      controller: 'RegisterController'
    });
}]);

app.run(['$rootScope', '$log', '$state', '$interval', '$location', 'storage', 'config', 'util', function($rootScope, $log, $state, $interval, $location, storage, config, util) {
  // authentication logic
  var token = storage.getSessionToken();
  var profile = storage.getCurrentUserProfile();
  if(token && profile) {
    // check if the user is manager or normal employee then reidirect to home
    if(profile.type === config.userRoles.HAIR_STYLIST) {
      $location.path('/hairstylist');
    } else if(profile.type === config.userRoles.INDIVIDUAL_USER) {
      $location.path('/user');
    } else if(profile.type === config.userRoles.BUSINESS_OWNER) {
      $location.path('/businessowner');
    } else {
      $location.path('/');
    }
  } else {
    // redirect to login
    $location.path('/');
  }

  $rootScope.getHome = function() {
    var profile = storage.getCurrentUserProfile();
    if(profile.type === config.userRoles.HAIR_STYLIST) {
      return '/hairstylist';
    } else if(profile.type === config.userRoles.INDIVIDUAL_USER) {
      return '/user';
    } else if(profile.type === config.userRoles.BUSINESS_OWNER) {
      return '/businessowner';
    } else {
      return '/';
    }
  };

  $rootScope.$on('$routeChangeStart', function () {
    var path = $location.path();
    // check if the user is authorized
    if(util.isLoggedIn()) {
      // check the user home page
      if(path === '/hairstylist') {
        $location.path($rootScope.getHome());
      } else if(path === '/businessowner') {
        $location.path($rootScope.getHome());
      } else if(path === '/user') {
        $location.path($rootScope.getHome());
      } else if(path === '/') {
        $location.path($rootScope.getHome());
      }
    } else if(config.publicRoutes.indexOf(path) === -1) {
      $location.path('/');
    }
  });

  $rootScope.logout = function() {
    storage.clear();
    $location.path('/');
  };
}]);