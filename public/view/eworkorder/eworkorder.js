'use strict';

angular.module('PGapp.eworkorder', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/edit_workorder/:id', {
    templateUrl: 'view/eworkorder/eworkorder.html',
    controller: 'EworkorderCtrl'
  });
}])

    .controller('EworkorderCtrl', ["$scope", "$cookies", "$location", 'API', '$routeParams', function ($scope, $cookies, $location, API, $routeParams) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
      $scope.updateWorkOrder = updateWorkOrder;
      var currentId = $routeParams.id;
  var userdetail = $cookies.getObject('userDetails');
      $scope.workOrder = {
        workorder_number: currentId,
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
      $scope.disableSkill = true;
      $scope.disableTechnician = true;
      $scope.disableClass = true;
      $scope.readOnlyPMTask = true;
      $scope.readOnlyNextPMDate = true;
      $scope.readOnlyFrequency = true;
  if(userdetail.role == 'technician') {
    $scope.showTechnician = false;
    $scope.disableEquipmentCost = false;
    $scope.disableTimeSpent = false;
    $scope.disableDateCompleted = false;
  }

      if (userdetail.role == 'manager') {
        $scope.disableSkill = false;
        $scope.disableTechnician = false;
        $scope.disableClass = false;
        $scope.readOnlyPMTask = false;
        $scope.readOnlyNextPMDate = false;
        $scope.readOnlyFrequency = false;
        //$scope.showTechnician = true;
        $scope.disableFacility = false;
        $scope.disableCategory = false;
        $scope.disableEquipment = false;
        $scope.disablePriority = false;
      }

  if(userdetail.role == 'clerk') {
    $scope.showClerk = true;
  }
      API.GetWorkOrder.Recent({workorder_number: currentId}, function (res) {
        if (res.Code == 200) {

          $scope.workOrder = res.Info.workorder;
          API.GetUser.Recent($scope.workOrder, function (res) {
            if (res.Code == 200) {
              $scope.requestor_name = res.Info.user.username;
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

      $scope.facilities = $cookies.getObject('facilities');
      //$scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;

      //$scope.workOrder= $scope.facilities[0].facility_number;
      //console.log($scope.facilities);
      $scope.selected_facility = $scope.facilities[0].facility_number;
      API.SCategory.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.categories = res.Info.categories;
          //$scope.workOrder.workorder_category = $scope.categories[0]._id;
          //$cookies.put('userDetails',res)
        } else {

        }

      }, function (error) {
        alert(error);
      });
      API.SEquipment.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.equipments = res.Info.equipments;
          $scope.workOrder.workorder_equipment = $scope.equipments[0]._id;
          //$cookies.put('userDetails',res)
        } else {

        }

      }, function (error) {
        alert(error);
      });
      API.SPriority.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.priorities = res.Info.priorities;
          $scope.workOrder.workorder_priority = $scope.priorities[0]._id;
          //$cookies.put('userDetails',res)
        } else {
        }
      }, function (error) {
        alert(error);
      });
      API.SSkill.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.skills = res.Info.skills;
          $scope.workOrder.workorder_skill = $scope.skills[0]._id;
          //$cookies.put('userDetails',res)
        } else {
        }
      }, function (error) {
        alert(error);
      });
      API.SClass.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.classes = res.Info.classes;
          $scope.workOrder.workorder_class = $scope.classes[0]._id;
          //$cookies.put('userDetails',res)
        } else {
        }
      }, function (error) {
        alert(error);
      });
      API.SStatus.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.statuses = res.Info.statuses;
          $scope.workOrder.status = $scope.statuses[0].status_number;
          //$cookies.put('userDetails',res)
        } else {
        }
      }, function (error) {
        alert(error);
      });
      API.GetUserByType.Recent({facility_number: $scope.selected_facility}, function (res) {
        if (res.Code == 200) {

          $scope.technicians = res.Info.users;
          $scope.workOrder.workorder_technician = $scope.technicians[0]._id;
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

      function updateWorkOrder() {
        console.log($scope.workOrder.workorder_technician);
        console.log($scope.workOrder.workorder_skill);
        console.log($scope.workOrder.workorder_class);
        console.log($scope.workOrder.workorder_priority);
        console.log($scope.workOrder.workorder_category);

        console.log($scope.workOrder.workorder_facility);
        console.log($scope.workOrder.workorder_equipment);
        console.log($scope.workOrder.status);

        console.log($scope.workOrder);
  }
}]);