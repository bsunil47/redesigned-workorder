'use strict';

angular.module('PGapp.cworkorder', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create_workorder', {
    templateUrl: 'view/cworkorder/cworkorder.html',
    controller: 'CworkorderCtrl'
  });
}])

    .controller('CworkorderCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
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
    $scope.disableFacility = true;
    $scope.disableCategory = false;
    $scope.disableEquipment = false;
    $scope.disablePriority = false;
    $scope.workOrder.creator = userdetail.user._id;
    $scope.requestor_name = userdetail.user.firstname;
    $scope.workorder_number = "WO-" + new Date().valueOf() + "-XX";
    $scope.workOrder.workorder_number = "WO-" + new Date().valueOf();
    var currentDt = new Date();
    var mm = currentDt.getMonth() + 1;
    mm = (mm < 10) ? '0' + mm : mm;
    var dd = currentDt.getDate();
    var yyyy = currentDt.getFullYear();
    var date = mm + '/' + dd + '/' + yyyy;
    $scope.today = date;
    //$scope.today = new Date();

  }
  $scope.workOrderTitle = "Create Work Order";
  //$scope.showTechnician = false;
  //$scope.disableFacility = false;
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

  $scope.facilities = $cookies.getObject('facilities');
  $scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;

  //$scope.workOrder= $scope.facilities[0].facility_number;
  console.log($scope.facilities);
      $scope.selected_facility = $scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;
      API.SFacilities.Recent(userdetail.user, function (res) {
        if (res.Code == 200) {
          $scope.facilities = res.Info.facilities;
          $scope.selected_facility = $scope.facilities[0].facility_number;
          $scope.selected_facility = $scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;
          $cookies.putObject('facilities', res.Info.facilities);
          API.SCategory.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

              $scope.categories = res.Info.categories;
              $scope.workOrder.workorder_category = $scope.categories[0]._id;
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
          //$cookies.put('userDetails',res)
        } else {

        }

      }, function (error) {
        alert(error);
      });




  function CreateWorkOrder() {
    if ($scope.CreateWorkOrderForm.workorder_description.$valid) {
      var data_post = $scope.workOrder;
      data_post.created_on = new Date(data_post.created_on).valueOf();
      $scope.user_id = API.CreateWorkOrder.save(data_post, function (res) {
        if (res.Code == 200) {
          swal({
            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br></br>',
            html: 'WorkOrder #' + $filter('setPadZeros')(res.Info.workorder_number, 8) + ' created and email has been sent to manager',
            width: "450px",
            confirmButtonText: 'Ok'
          });
          $location.path("/dashboard");
        } else {
          swal({
            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br></br>',
            html: 'Promblem creating workorder',
            width: "450px",
            confirmButtonText: 'Ok'
          });
          $scope.CreateWorkOrderForm.workorder_description.error = true;
        }
      }, function (error) {
        swal({
          title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
          text: "Oop's.. Something went worng.. Try again later",
          width: "450px",
          confirmButtonText: 'Ok'
        });
      });
    }
  }
}]);