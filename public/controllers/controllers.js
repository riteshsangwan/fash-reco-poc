'use strict';

var appControllers = angular.module('fashRecoApp.controllers', ['fashRecoApp.services']);

// Landing controller
appControllers.controller('LandingController', ['$scope', '$state', function ($scope, $state) {

  $scope.login = function() {
    $state.go('login');
  };

  $scope.register = function() {
    $state.go('register');
  };
}]);

// login controller
appControllers.controller('LoginController', ['$scope', '$state', 'SecurityService', 'UserService', 'config', 'storage', 'notify', function ($scope, $state, SecurityService, UserService, config, storage, notify) {
  $scope.rememberMe = false;
  var loginHandler = function(token) {
    UserService.me().then(function(profile) {
      if(profile.type === config.userRoles.BUSINESS_OWNER) {
        $state.go('businessowner');
      } else if(profile.type === config.userRoles.INDIVIDUAL_USER) {
        $state.go('user');
      } else if(profile.type === config.userRoles.HAIR_STYLIST) {
        $state.go('hairstylist');
      }
    }, function(profileReason) {
      // show notify popup
    });
  };

  $scope.login = function(credentials) {
    SecurityService.authenticate(credentials, $scope.rememberMe).then(function(data) {
      loginHandler(data.sessionToken);
    }, function(reason) {
      // show notify popup
    });
  };
}]);

// register controller
appControllers.controller('RegisterController', ['$scope', 'UserService', 'config', function ($scope, UserService, config) {

  $scope.register = function(registration) {
    UserService.register(registration).then(function() {

    }, function(reason) {

    });
  };
}]);

// user controller
appControllers.controller('UserController', ['$scope', function ($scope) {

}]);

// Business owner controller
appControllers.controller('BusinessOwnerController', ['$scope', function ($scope) {

}]);

// Hair stylist controller
appControllers.controller('HairStylistController', ['$scope', function ($scope) {

}]);