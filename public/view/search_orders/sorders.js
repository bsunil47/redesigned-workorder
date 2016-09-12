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
  var userdetail = $cookies.getObject('userDetails');
  API.ManageWorkorders.Recent(userdetail.user, function (res) {
    if (res.Code == 200) {

      $scope.workOrders = res.Info.workorders;
      //$cookies.put('userDetails',res)
    } else {

    }

  }, function (error) {
    alert(error);
  });
  $scope.editWorkOrder = function (workorder_id) {
    $location.path('edit_workorder/'+workorder_id);
  };
  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
}]);