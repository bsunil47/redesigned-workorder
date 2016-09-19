'use strict';

angular.module('PGapp.eworkorder', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMaterial', 'dnTimepicker'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/edit_workorder/:id', {
    templateUrl: 'view/eworkorder/eworkorder.html',
    controller: 'EworkorderCtrl'
  });
}])

    .controller('EworkorderCtrl', ["$scope", "$cookies", "$location", 'API', '$filter', '$routeParams', function ($scope, $cookies, $location, API, $filter, $routeParams) {
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
          wo_pm_number: "",
          pm_task: 0,
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
            $scope.workOrder.workorder_number = $filter('setPadZeros')($scope.workOrder.workorder_number, 8);
            console.log($scope.workOrder.workorder_number);

            var currentDt = new Date(parseInt($scope.workOrder.created_on));
            var mm = currentDt.getMonth() + 1;
            mm = (mm < 10) ? '0' + mm : mm;
            var dd = currentDt.getDate();
            var yyyy = currentDt.getFullYear();
            var date = mm + '/' + dd + '/' + yyyy;
            $scope.workOrder.created_on = date;
            if (!angular.isUndefined($scope.workOrder.wo_datecomplete)) {
                $scope.workOrder.wo_datecomplete = new Date(parseInt($scope.workOrder.wo_datecomplete));
                $scope.maxDate = new Date(
                    $scope.workOrder.wo_datecomplete.getFullYear(),
                    $scope.workOrder.wo_datecomplete.getMonth(),
                    $scope.workOrder.wo_datecomplete.getDate());
            }
            $scope.minDate = new Date(
                currentDt.getFullYear(),
                currentDt.getMonth(),
                currentDt.getDate());
            $scope.selected_facility = $scope.workOrder.workorder_facility;
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


            API.GetUser.Recent($scope.workOrder, function (res) {
            if (res.Code == 200) {
              $scope.requestor_name = res.Info.user.username;
            }
          }, function (error) {
            alert(error);
          });
            if ($scope.workOrder.wo_pm_number != "") {
                API.GetPMTask.Recent({pm_number: $scope.workOrder.workorder_PM}, function (res) {
                    if (res.Code == 200) {
                        var currentDt = new Date(res.Info.pm_task.pm_previous_date);
                        var mm = currentDt.getMonth() + 1;
                        mm = (mm < 10) ? '0' + mm : mm;
                        var dd = currentDt.getDate();
                        var yyyy = currentDt.getFullYear();
                        var date = mm + '/' + dd + '/' + yyyy;
                        $scope.workOrder.wo_pm_previous_date = date;
                        $scope.workOrder.wo_pm_date = res.Info.pm_task.pm_next_date;
                        $scope.workOrder.wo_pm_frequency = res.Info.pm_task.pm_frequency;
                        $scope.workOrder.wo_pm_number = res.Info.pm_task.pm_number;
                        $scope.workOrder.pm_task = 1;
                    }
                }, function (error) {
                    alert(error);
                });
            }

          //$cookies.put('userDetails',res)
        } else {

        }

      }, function (error) {
        alert(error);
      });

        $scope.myDate = new Date();

      $scope.facilities = $cookies.getObject('facilities');
      //$scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;

      //$scope.workOrder= $scope.facilities[0].facility_number;
      //console.log($scope.facilities);



        $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }

        $scope.pgWorkOrder = function () {
            console.log($scope.workOrder.wo_pm_frequency);

            if ($scope.workOrder.wo_pm_frequency > 0) {
                var currentDt = new Date();
                currentDt.setDate(currentDt.getDate() + parseInt($scope.workOrder.wo_pm_frequency));
                var mm = currentDt.getMonth() + 1;
                mm = (mm < 10) ? '0' + mm : mm;
                var dd = currentDt.getDate();
                var yyyy = currentDt.getFullYear();
                var date = mm + '/' + dd + '/' + yyyy;
                $scope.workOrder.wo_pm_date = date;
                $scope.workOrder.wo_pm_number = 'PM-{date-string}' + "-XX"
            } else {
                $scope.workOrder.wo_pm_date = "";
                if ($scope.workOrder.pm_task == 0) {
                    $scope.workOrder.wo_pm_number = "";
                }

            }

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
          var data_post = $scope.workOrder;
          if (!angular.isUndefined($scope.workOrder.wo_datecomplete)) {
              data_post.wo_datecomplete = new Date($scope.workOrder.wo_datecomplete).valueOf();
          }
          //data_post.wo_datecomplete = new Date($scope.workOrder.wo_datecomplete).valueOf();
          data_post.created_on = new Date(data_post.created_on).valueOf();
          data_post.user_id = userdetail.user._id;

          API.UpdateWorkOrder.Recent(data_post, function (res) {
              if (res.Code == 200) {
                  //$scope.categories = res.Info.categories;
                  //$scope.workOrder.workorder_category = $scope.categories[0]._id;
                  //$cookies.put('userDetails',res);
                  if (userdetail.role == 'technician') {
                      var msg = "WorkOrder has been updated and an email has been sent to manager.";
                  } else {
                      if (userdetail.role == 'manager') {
                          var msg = "WorkOrder assigned to " + $scope.showtechnician($scope.workOrder.workorder_technician) + " an email has been sent.";
                      } else {
                          var msg = "WorkOrder parts recived, an email has been sent to " + $scope.showtechnician($scope.workOrder.workorder_technician) + ".";
                      }
                  }
                  swal({
                      title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                      text: msg,
                      width: "450px",
                      confirmButtonText: 'Ok'
                  });
                  $location.path("/search_workorder");
              } else {
                  swal({
                      title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                      text: "WorkOrder has'nt been updated",
                      width: "450px",
                      confirmButtonText: 'Ok'
                  });
              }

          }, function (error) {
              swal({
                  title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                  text: "Oop's.. Something went worng.. Try again later",
                  width: "450px",
                  confirmButtonText: 'Ok'
              });
          });

          $scope.showtechnician = function (technicain) {
              var found = $filter('getByFacilityNumber')('_id', technicain, $scope.technicians);
              if (angular.isUndefined(found) || found === null) {
                  return null;
              }
              return found.firstname;
          }
  }
}]);