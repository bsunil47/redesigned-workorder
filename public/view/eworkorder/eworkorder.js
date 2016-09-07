'use strict';

angular.module('PGapp.eworkorder', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/edit_workorder/:id', {
    templateUrl: 'view/eworkorder/eworkorder.html',
    controller: 'EworkorderCtrl'
  });
}])

.controller('EworkorderCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  var userdetail = $cookies.getObject('userDetails');
  $scope.workOrderTitle = "Edit Work Order";
  $scope.showTechnician = false;
  $scope.disableFacility = true;
  $scope.disableCategory = true;
  $scope.disableEquipment = true;
  $scope.disablePriority = true;
  $scope.disableEquipmentCost = true;
  $scope.disableTimeSpent = true;
  $scope.disableDateCompleted = true;
  $scope.showClerk = false;
  //$scope.showTechnician = false;
  //$scope.disableFacility = false;
  //$scope.disableCategory = false;
  //$scope.disableEquipment = false;
  //$scope.disablePriority = false;
  if(userdetail.role == 'technician') {
    $scope.showTechnician = false;
    $scope.disableEquipmentCost = false;
    $scope.disableTimeSpent = false;
    $scope.disableDateCompleted = false;
  }

  if(userdetail.role == 'clerk') {
    $scope.showClerk = true;
  }


  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
}]);