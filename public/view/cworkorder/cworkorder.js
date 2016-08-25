'use strict';

angular.module('PGapp.cworkorder', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create_workorder', {
    templateUrl: 'view/cworkorder/cworkorder.html',
    controller: 'CworkorderCtrl'
  });
}])

.controller('CworkorderCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  var userdetail = $cookies.getObject('userDetails');
  $scope.workOrderTitle = "Edit Work Order";
  $scope.showTechnician = true;
  $scope.disableFacility = true;
  $scope.disableCategory = true;
  $scope.disableEquipment = true;
  $scope.disablePriority = true;
  if(userdetail.role == 'operator'){
    //$scope.showTechnician = false;
    $scope.disableFacility = false;
    $scope.disableCategory = false;
    $scope.disableEquipment = false;
    $scope.disablePriority = false;

  }
  $scope.workOrderTitle = "Create Work Order";
  //$scope.showTechnician = false;
  $scope.disableFacility = false;
  $scope.disableCategory = false;
  $scope.disableEquipment = false;
  $scope.disablePriority = false;
  if(userdetail.role == 'technician') {
    $scope.showTechnician = false;
  }


  $scope.Logout = function () {
    $cookies.remove('userDetails')
    $location.path("/");
  }
}]);