'use strict';

angular.module('PGapp.partslist', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/parts_list', {
    templateUrl: 'view/parts_list/partslist.html',
    controller: 'PlistCtrl'
  });
}])

    .controller('PlistCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
      var userdetail = $cookies.getObject('userDetails');
      API.Equipments.Recent(userdetail.user, function (res) {
        if (res.Code == 200) {

          $scope.equipments = res.Info.equipments;
          //$cookies.put('userDetails',res)
        } else {

        }

      }, function (error) {
        alert(error);
      });
  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
      $scope.$watch("equipment_number", function (newValue, oldValue) {
        if (!angular.isUndefined($scope.equipment_number)) {
          var found = $filter('getByFacilityNumber')('equipment_number', $scope.equipment_number, $scope.equipments);
          if (angular.isUndefined(found) || found === null) {
            return null;
          }
          $scope.parts = found.equipments;
        }
      });
      $scope.p = [];

      $scope.createPartRequest = function (part) {

        if (!angular.isUndefined($scope.p.qty)) {
          var set = {
            equipment_number: $scope.equipment_number,
            material_number: part,
            qty: $scope.p.qty[part],
            user_id: userdetail.user._id,
          };

          if (!angular.isUndefined($scope.p.workorder)) {
            set.workorder_number = $scope.p.workorder[part];
          }
          API.CreatePartsRequest.Recent(set, function (res) {
            if (res.Code == 200) {
              swal({
                title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                text: 'Sucessfully Created',
                width: "450px",
                confirmButtonText: 'Ok'
              });
              $location.path("/parts_list");
            } else {
              
              //$scope.CreateUserForm.email.error = true;
            }
          }, function (error) {
            alert(error);
          });
        } else {
          swal({
            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
            text: 'Need qty for selected part request',
            width: "450px",
            confirmButtonText: 'Ok'
          });
        }

      }
}]);