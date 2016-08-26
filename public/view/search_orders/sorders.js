'use strict';

angular.module('PGapp.sorders', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search_workorder', {
    templateUrl: 'view/search_orders/sorders.html',
    controller: 'SordersCtrl'
  });
}])

.controller('SordersCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  $scope.editWorkOrder = function (workorder_id) {
    $location.path('edit_workorder/'+workorder_id);
  }
  $scope.Logout = function () {
    $cookies.remove('userDetails')
    $location.path("/");
  }
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
}]);