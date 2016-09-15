'use strict';

angular.module('PGapp.sorders', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search_workorder', {
    templateUrl: 'view/search_orders/sorders.html',
    controller: 'SordersCtrl'
  });
}])

    .controller('SordersCtrl', ["$scope", "$cookies", "$location", '$filter', 'API', function ($scope, $cookies, $location, $filter, API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  var userdetail = $cookies.getObject('userDetails');
      $scope.facilities = $cookies.getObject('facilities');
      $scope.selected_facility = $scope.facilities[0].facility_number;
  API.ManageWorkorders.Recent(userdetail.user, function (res) {
    if (res.Code == 200) {

      $scope.workOrders = res.Info.workorders;
      API.SEquipment.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.equipments = res.Info.equipments;


          //$cookies.put('userDetails',res)
        } else {

        }

      }, function (error) {
        alert(error);
      });
      
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

      $scope.showEquipment = function (equipment) {
        console.log(equipment);
        var found = $filter('getByFacilityNumber')('_id', equipment, $scope.equipments);
        if (angular.isUndefined(found) || found === null) {
          return null;
        }
        return found.equipment_name;
      }
}]);