'use strict';

angular.module('PGapp.cworkorder', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create_workorder', {
    templateUrl: 'view/cworkorder/cworkorder.html',
    controller: 'CworkorderCtrl'
  });
}])

.controller('CworkorderCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  $scope.CreateWorkOrder = CreateWorkOrder;
  var userdetail = $cookies.getObject('userDetails');
  $scope.workOrder = {
    workorder_number: "",
    workorder_creator: "",
    workorder_faciity: "",
    workorder_category: "",
    workorder_equipment: "",
    workorder_priority: "",
    workorder_skill: "",
    workorder_technician: "",
    workorder_class: "",
    wo_goodsreceipt: "",
    wo_equipmentcost: "",
    wo_timespent: 0,
    wo_datecomplete: "",
    workorder_description: "",
    workorder_leadcomments: "",
    workorder_actiontaken: "",
    status: 1
  };
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
    $scope.workOrder.creator = userdetail.user._id;
    $scope.requestor_name = userdetail.user.firstname;
    $scope.workorder_number = "WO-" + new Date().valueOf() + "-XX";
    $scope.workOrder.workorder_number = "WO-" + new Date().valueOf();
    $scope.today = new Date();

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
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  };

  function CreateWorkOrder() {
    if ($scope.CreateWorkOrderForm.workorder_description.$valid) {
      $scope.user_id = API.CreateWorkOrder.save($scope.workOrder, function (res) {
        if (res.Code == 200) {
          $location.path("/dashboard");
        } else {
          $scope.CreateWorkOrderForm.workorder_description.error = true;
        }
      }, function (error) {
        alert(error);
      });
    }
  }
}]);