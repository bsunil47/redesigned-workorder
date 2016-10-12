'use strict';

//noinspection GjsLint
angular.module('PGapp.dashboard', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'view/dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])

.controller('DashboardCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {

  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  var userdetail = $cookies.getObject('userDetails');
  API.Facilities.Recent(userdetail.user, function (res) {
    if (res.Code == 200) {
      $scope.facilities = res.Info.facilities;
      $cookies.putObject('facilities', res.Info.facilities);
      //$cookies.put('userDetails',res)
    } else {

    }

  }, function (error) {
    alert(error);
  });
  $scope.screenTypeTitle = userdetail.role.charAt(0).toUpperCase() + userdetail.role.slice(1);
  $scope.showAdmin= false;
  $scope.showManager= false;
  $scope.hideCreateworkorder = false;
  $scope.hidePartList = false;
  $scope.hideSearchWorkOrder = false;

  if(userdetail.role == 'admin'){
    $scope.showAdmin= true;
      $scope.hideCreateworkorder = true;
      $scope.hidePartList = true;
      $scope.hideSearchWorkOrder = true;

  }
  if(userdetail.role == 'admin' || userdetail.role == 'manager'){
    $scope.showManager= true;
    if (userdetail.role == 'manager') {
      $scope.hideCreateworkorder = true;
        $scope.hidePartList = true;
    }
  }

  if(userdetail.role == 'technician'){
    $scope.hideCreateworkorder= true;
  }
  if(userdetail.role == 'operator') {
    $scope.hideSearchWorkOrder = true;
    $scope.hidePartList = true;
  }
  if(userdetail.role == 'clerk'){
    $scope.hideCreateworkorder = true;
    $scope.hidePartList = true;
  }
  $scope.Logout = function () {
    $cookies.remove('userDetails')
    $location.path("/");
  }

  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }


}]);