'use strict';

angular.module('PGapp.systemsettings', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/system_settings', {
    templateUrl: 'view/system_settings/systemsettings.html',
    controller: 'SsettingsCtrl'
  });
}])

.controller('SsettingsCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
}]);