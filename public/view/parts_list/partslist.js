'use strict';

angular.module('PGapp.partslist', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/parts_list', {
    templateUrl: 'view/parts_list/partslist.html',
    controller: 'PlistCtrl'
  });
}])

.controller('PlistCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  $scope.Logout = function () {
    $cookies.remove('userDetails')
    $location.path("/");
  }
}]);