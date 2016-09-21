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
            wo_pm_number: "",
            pm_task: 0,
            status: 1
        };
  var userdetail = $cookies.getObject('userDetails');
      $scope.facilities = $cookies.getObject('facilities');
      $scope.selected_facility = $scope.facilities[0].facility_number;
        API.Equipments.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.allequipments = res.Info.equipments;

                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });
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
        $scope.facilities = $cookies.getObject('facilities');
        //$scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;

        //$scope.workOrder= $scope.facilities[0].facility_number;
        //console.log($scope.facilities);
        $scope.selected_facility = $scope.facilities[0].facility_number;
        API.SCategory.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

                $scope.categories = res.Info.categories;
                if ($scope.workOrder.workorder_category == "") {
                    $scope.workOrder.workorder_category = $scope.categories[0]._id;
                }

                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });
        API.SEquipment.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

                $scope.equipments = res.Info.equipments;
                if ($scope.workOrder.workorder_equipment == "") {
                    $scope.workOrder.workorder_equipment = $scope.equipments[0]._id;
                }

                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });
        API.SPriority.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

                $scope.priorities = res.Info.priorities;
                if ($scope.workOrder.workorder_priority == "") {
                    $scope.workOrder.workorder_priority = $scope.priorities[0]._id;
                }

                //$cookies.put('userDetails',res)
            } else {
            }
        }, function (error) {
            alert(error);
        });
        API.SSkill.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

                $scope.skills = res.Info.skills;
                if ($scope.workOrder.workorder_skill == "") {
                    $scope.workOrder.workorder_skill = $scope.skills[0]._id;
                }

                //$cookies.put('userDetails',res)
            } else {
            }
        }, function (error) {
            alert(error);
        });
        API.SClass.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

                $scope.classes = res.Info.classes;
                if ($scope.workOrder.workorder_class == "") {
                    $scope.workOrder.workorder_class = $scope.classes[0]._id;
                }

                //$cookies.put('userDetails',res)
            } else {
            }
        }, function (error) {
            alert(error);
        });
        API.SStatus.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

                $scope.statuses = res.Info.statuses;
                if ($scope.workOrder.status == "") {
                    $scope.workOrder.status = $scope.statuses[0].status_number;
                }

                //$cookies.put('userDetails',res)
            } else {
            }
        }, function (error) {
            alert(error);
        });
        API.GetUserByType.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {

                $scope.technicians = res.Info.users;
                if ($scope.workOrder.workorder_technician == "") {
                    $scope.workOrder.workorder_technician = $scope.technicians[0]._id;
                }
                //$scope.workOrder.workorder_technician = $scope.technicians[0]._id;
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
        $scope.showWithzeros = function (Order) {
            return $filter('setPadZeros')(Order, 8);
        }


        var status_list;
        API.Status.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                status_list = res.Info.status_list;
                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });

      $scope.showEquipment = function (equipment) {
          var found = $filter('getByFacilityNumber')('_id', equipment, $scope.allequipments);
        if (angular.isUndefined(found) || found === null) {
          return null;
        }
        return found.equipment_name;
      }
        $scope.showStatus = function (status_number) {
            var found = $filter('getByFacilityNumber')('status_number', status_number, status_list);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.status_name;
        }
        $scope.showEdit = function (status) {
            console.log(status);
            if (status == 2 && userdetail.role == 'technician') {
                return false;
            } else {
                return true;
            }
        }

}]);