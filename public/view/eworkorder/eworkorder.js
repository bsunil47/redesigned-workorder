'use strict';

angular.module('PGapp.eworkorder', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMaterial', 'dnTimepicker'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/edit_workorder/:id', {
            templateUrl: 'view/eworkorder/eworkorder.html',
            controller: 'EworkorderCtrl'
        });
    }])

    .controller('EworkorderCtrl', ["$scope", "$cookies", "$location", "$window", 'API', '$filter', '$routeParams', function ($scope, $cookies, $location, $window, API, $filter, $routeParams) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        $scope.updateWorkOrder = updateWorkOrder;
        var currentId = parseInt($routeParams.id);
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            $location.path(reloc);

        };
        var workorder_created_on;
        var wo_pm_date;
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
            wo_timespent: "00:00",
            wo_datecomplete: "",
            workorder_description: "",
            workorder_leadcomments: "",
            workorder_actiontaken: "",
            wo_pm_number: "",
            pm_task: 0,
            status: 1
        };
        $scope.today = new Date();
        $scope.minDate = new Date();
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
        $scope.accessManager = true;
        $scope.disableSkill = true;
        $scope.disableTechnician = true;
        $scope.disableClass = true;
        $scope.readOnlyPMTask = true;
        $scope.readOnlyNextPMDate = true;
        $scope.readOnlyFrequency = true;
        $scope.reqPMTask = false;
        $scope.reqCost = false;
        $scope.reqDateComplete = false;
        $scope.reqTimeSpent = false;
        $scope.reqActionTaken = false;
        $scope.reqPMFreq = false;
        $scope.accessActionTaken = false;
        $scope.disableClerk = false;
        if (userdetail.role == 'technician') {
            $scope.showTechnician = false;
            $scope.disableEquipmentCost = false;
            $scope.disableTimeSpent = false;
            $scope.disableDateCompleted = false;
            $scope.reqCost = true;
            $scope.reqDateComplete = true;
            $scope.reqTimeSpent = true;
            $scope.reqActionTaken = true;
        }

        if (userdetail.role == 'manager') {
            $scope.disableSkill = false;
            $scope.disableTechnician = false;
            $scope.disableClass = false;
            $scope.readOnlyPMTask = false;
            $scope.readOnlyNextPMDate = true;
            $scope.readOnlyFrequency = false;
            //$scope.showTechnician = true;
            $scope.disableFacility = false;
            $scope.disableCategory = false;
            $scope.disableEquipment = false;
            $scope.disablePriority = false;
            $scope.accessManager = false;

        }

        if (userdetail.role == 'clerk') {
            $scope.showClerk = true;
            $scope.accessActionTaken = true;
            $scope.disableClerk = true;
        }
        $scope.checkGoods = false;
        API.GetWorkOrder.Recent({workorder_number: currentId}, function (res) {
            if (res.Code == 200) {

                $scope.workOrder = res.Info.workorder;
                if (!angular.isUndefined($scope.workOrder.wo_pm_date)) {
                    wo_pm_date = $scope.workOrder.wo_pm_date;
                }
                workorder_created_on = res.Info.workorder.created_on;
                if ($scope.workOrder.status == 2) {
                    $scope.reqPMTask = true;
                }
                if (!angular.isUndefined($scope.workOrder.wo_goodsreceipt)) {
                    if ($scope.workOrder.wo_goodsreceipt) {
                        $scope.checkGoods = true;
                    }
                }
                if (!angular.isUndefined($scope.workOrder.wo_equipmentcost)) {
                    console.log($scope.workOrder.wo_equipmentcost);
                    $scope.workOrder.wo_equipmentcost = parseInt($scope.workOrder.wo_equipmentcost);
                }
                $scope.workOrder.workorder_number = $filter('setPadZeros')($scope.workOrder.workorder_number, 8);
                if (userdetail.role == 'manager' && $scope.workOrder.status == 2) {
                    $scope.disableEquipmentCost = false;
                    $scope.disableTimeSpent = false;
                    $scope.disableDateCompleted = false;
                }
                $scope.workOrder.created_on = $filter('changeStringToDate')($scope.workOrder.created_on);
                var orderDt = new Date($scope.workOrder.created_on).valueOf();
                var currentDate = new Date($scope.workOrder.created_on);
                currentDate.setDate(currentDate.getDate() - 10);
                var lessDate = new Date(currentDate).valueOf();
                var currentDate = new Date($scope.workOrder.created_on);
                currentDate.setDate(currentDate.getDate() + 10);
                var grtDate = new Date(currentDate).valueOf();
                var orderDt = new Date($scope.workOrder.created_on).valueOf();
                var currentDate = new Date().valueOf();
                $scope.saveDisable = true;
                //if (parseInt(currentDate) > parseInt(lessDate) && parseInt(currentDate) < parseInt(grtDate) && !angular.isUndefined($scope.workOrder.workorder_PM)) {
                if (parseInt(currentDate) > parseInt(lessDate) && !angular.isUndefined($scope.workOrder.workorder_PM)) {
                    //console.log('compare');
                    $scope.saveDisable = false;
                } else {
                    if (angular.isUndefined($scope.workOrder.workorder_PM)) {
                        $scope.saveDisable = false;
                    }
                }
                if (userdetail.role == 'clerk' && ($scope.workOrder.status == 1 || $scope.workOrder.status == 3)) {
                    $scope.saveDisable = false;
                }
                if (userdetail.role == 'manager' && ($scope.workOrder.status == 1 || $scope.workOrder.status == 3)) {
                    $scope.saveDisable = false;
                }
                if (!angular.isUndefined($scope.workOrder.wo_datecomplete)) {
                    var min_date_diff = 10;
                    var min_date = $scope.workOrder.wo_datecomplete = new Date($filter('changeStringToDate')($scope.workOrder.wo_datecomplete));
                    if(wo_pm_date && $scope.workOrder.status==2)
                    {
                        min_date.setDate(min_date.getDate() - parseInt(min_date_diff));
                    }
                } else {
                    var min_date_diff = 10;
                    var min_date = new Date($scope.workOrder.created_on);
                    if(wo_pm_date && $scope.workOrder.status==2)
                    {
                        min_date.setDate(min_date.getDate() - parseInt(min_date_diff));
                    }
                    
                }
                $scope.minDate = new Date(
                    min_date.getFullYear(),
                    min_date.getMonth(),
                    min_date.getDate());
                var currentDt = new Date();
                $scope.maxDate = new Date(
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
                if (userdetail.user._id != $scope.workOrder.workorder_technician && userdetail.role == 'technician') {
                    $scope.saveDisable = true;
                }
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
                if (!angular.isUndefined($scope.workOrder.workorder_PM)) {
                    $scope.workOrder.wo_pm_number = $scope.workOrder.workorder_PM;
                    if ($scope.workOrder.wo_pm_number != "") {
                        $scope.pmTaskAlreadySet = false;
                        API.GetPMTask.Recent({pm_number: $scope.workOrder.workorder_PM}, function (res) {
                            if (res.Code == 200) {
                                var currentDt = new Date(res.Info.pm_task.pm_previous_date);
                                var mm = currentDt.getMonth() + 1;
                                mm = (mm < 10) ? '0' + mm : mm;
                                var dd = currentDt.getDate();
                                var yyyy = currentDt.getFullYear();
                                var date = mm + '/' + dd + '/' + yyyy;
                                $scope.workOrder.wo_pm_previous_date = date;
                                $scope.workOrder.wo_pm_frequency = res.Info.pm_task.pm_frequency;
                                $scope.workOrder.wo_pm_number = res.Info.pm_task.pm_number;
                                $scope.workOrder.pm_task = 1;
                            }
                        }, function (error) {
                            alert(error);
                        });
                    }
                }

                API.GetUser.Recent($scope.workOrder, function (res) {
                    if (res.Code == 200) {
                        $scope.requestor_name = res.Info.user.username;
                    }
                }, function (error) {
                    alert(error);
                });
                $scope.pmTaskAlreadySet = true;
                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });

        $scope.myDate = new Date();

        $scope.facilities = $cookies.getObject('facilities');

        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };

        function updateWorkOrder() {
            if (!$cookies.get('userDetails')) {
                $location.path('login');
            }
            console.log($scope.workOrder.workorder_technician);
            console.log($scope.workOrder.workorder_skill);
            console.log($scope.workOrder.workorder_class);
            console.log($scope.workOrder.workorder_priority);
            console.log($scope.workOrder.workorder_category);

            console.log($scope.workOrder.workorder_facility);
            console.log($scope.workOrder.workorder_equipment);
            console.log($scope.workOrder.status);

            console.log($scope.workOrder);
            console.log($scope.reqDateComplete);
            if (angular.isUndefined($scope.workOrder.wo_datecomplete)) {
                //$scope.workOrder.wo_datecomplete = new Date();
            }


            if ($scope.EditWorkOrderForm.$valid && $scope.EditWorkOrderForm.workorder_description.$valid && $scope.EditWorkOrderForm.workorder_skill.$valid && $scope.EditWorkOrderForm.workorder_class.$valid && $scope.EditWorkOrderForm.workorder_technician.$valid) {
                if (!angular.isUndefined($scope.workOrder.wo_datecomplete)) {
                    var mm = $scope.workOrder.wo_datecomplete.getMonth() + 1;
                    mm = (mm < 10) ? '0' + mm : mm;
                    var dd = $scope.workOrder.wo_datecomplete.getDate();
                    var yyyy = $scope.workOrder.wo_datecomplete.getFullYear();
                    var date = mm + '/' + dd + '/' + yyyy;
                    $scope.workOrder.wo_datecomplete = date;
                }
                var data_post = {};
                if (angular.isUndefined($scope.workOrder.wo_pm_number)) {
                    $scope.workOrder.workorder_PM = "";
                } else {
                    if ($scope.workOrder.wo_pm_number == "") {
                        $scope.workOrder.workorder_PM = "";
                    } else {
                        $scope.workOrder.workorder_PM = $scope.workOrder.wo_pm_number;
                    }
                }
                console.log("wo_pm_date: " + wo_pm_date);
                console.log("$scope.workOrder.status: " + $scope.workOrder.status);
                if(wo_pm_date && $scope.workOrder.status == 2)
                    {
                        var WODC = new Date($scope.workOrder.wo_datecomplete);
                        var WOCO = new Date($scope.workOrder.created_on);
                        console.log("WODC: " + WODC);
                        console.log("WOCO: " + WOCO);
                        
                        var daysdiff = (WOCO - WODC) / 1000 / 60 / 60 / 24;   
                        console.log("daysdiff: " + daysdiff);
                        if(daysdiff > 0 && daysdiff <= 10)
                        {
                            var mmwodc = WODC.getMonth() + 1;
                            mmwodc = (mmwodc < 10) ? '0' + mmwodc : mmwodc;
                            var ddwodc = WODC.getDate();
                            var yyyywodc = WODC.getFullYear();
                            var datewodc = mmwodc + '/' + ddwodc + '/' + yyyywodc;
                            $scope.workOrder.created_on = datewodc;
                            var wopmdate = WODC;//new Date($filter('changeStringToDate')(wo_pm_date));
                            console.log('wopmdate: ' + wopmdate);
                            wopmdate.setDate(WODC.getDate() + parseInt($scope.workOrder.wo_pm_frequency));
                            console.log('wopmdate: ' + wopmdate);
                            var mmwopmd = wopmdate.getMonth() + 1 ;
                            mmwopmd = (mmwopmd < 10) ? '0' + mmwopmd : mmwopmd;
                            var ddwopmd = wopmdate.getDate();
                            var yyyywopmd = wopmdate.getFullYear();
                            var datewopmd = mmwopmd + '/' + ddwopmd + '/' + yyyywopmd;
                            console.log("datewopmd: "+ datewopmd);
                            $scope.workOrder.wo_pm_date = datewopmd;
                            console.log('$scope.workOrder.wo_pm_date: '+ $scope.workOrder.wo_pm_date);
                        }
                    }

                for (var i in $scope.workOrder) {
                    if (!isNullOrEmptyOrUndefined($scope.workOrder[i])) {
                        data_post[i] = $scope.workOrder[i];
                    }
                }
                data_post.user_id = userdetail.user._id;
                console.log("data_post: " + data_post);

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
                                var msg = "WorkOrder parts received, an email has been sent to " + $scope.showtechnician($scope.workOrder.workorder_technician) + ".";
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
                            text: res.Info,
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
            }
        }
        $scope.showtechnician = function (technicain) {
            var found = $filter('getByFacilityNumber')('_id', technicain, $scope.technicians);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.firstname;
        };
        /*$scope.showTimeChange = function () {
            if ($scope.workOrder.wo_timespent === "00:00") {
                console.log('asd');
                $scope.workOrder.wo_timespent = 'undefined';
            }
            console.log($scope.workOrder.wo_timespent);
         }*/
        $scope.$watch("workOrder.wo_pm_number", function (newValue, oldValue) {
            if (angular.isUndefined($scope.workOrder.wo_pm_number)) {
                $scope.workOrder.wo_pm_frequency = "";
                $scope.workOrder.wo_pm_date = "";
                $scope.workOrder.wo_pm_number = "";
                $scope.reqPMFreq = false;
            } else {
                $scope.reqPMFreq = true;
            }

            if ($scope.workOrder.wo_pm_number == "") {
                $scope.workOrder.wo_pm_frequency = "";
                $scope.workOrder.wo_pm_number = "";
                $scope.workOrder.wo_pm_date = "";
                $scope.reqPMFreq = false;
            }
            console.log($scope.reqPMFreq);
        });
        $scope.$watch("workOrder.wo_pm_frequency", function (newValue, oldValue) {
            if ($scope.workOrder.wo_pm_frequency > 0) {
                if (!isNullOrEmptyOrUndefined(wo_pm_date)) {
                    console.log('not null:' + wo_pm_date);
                    var currentDt = new Date($scope.workOrder.created_on);
                    currentDt.setDate(currentDt.getDate() + parseInt($scope.workOrder.wo_pm_frequency));
                } else {
                    var currentDt = new Date();
                    currentDt.setDate(currentDt.getDate() + parseInt($scope.workOrder.wo_pm_frequency));
                }

                var mm = currentDt.getMonth() + 1;
                mm = (mm < 10) ? '0' + mm : mm;
                var dd = currentDt.getDate();
                var yyyy = currentDt.getFullYear();
                var date = mm + '/' + dd + '/' + yyyy;
                $scope.workOrder.wo_pm_date = date;
                $scope.reqPMTask = true;
            }

            if ($scope.workOrder.wo_pm_frequency <= 0) {
                $scope.workOrder.wo_pm_date = "";
                $scope.reqPMTask = false;
                $scope.workOrder.wo_pm_frequency = "";
            }
            if (!isInt($scope.workOrder.wo_pm_frequency)) {
                $scope.workOrder.wo_pm_date = "";
                $scope.reqPMTask = false;
                $scope.workOrder.wo_pm_frequency = "";
            }
            if (angular.isUndefined($scope.workOrder.wo_pm_frequency)) {
                $scope.workOrder.wo_pm_date = "";
                $scope.reqPMTask = false;
                $scope.workOrder.wo_pm_frequency = "";
            }
        });
        $scope.$watch("workOrder.status", function (newValue, oldValue) {
            if (userdetail.role == 'technician') {
                if ($scope.workOrder.status == 3) {
                    $scope.reqCost = false;
                    $scope.reqDateComplete = false;
                    $scope.reqTimeSpent = false;
                    $scope.reqActionTaken = false;
                } else {
                    $scope.reqCost = true;
                    $scope.reqDateComplete = true;
                    $scope.reqTimeSpent = true;
                    $scope.reqActionTaken = true;
                }
            }
        });
        $scope.$watch("workOrder.wo_equipmentcost", function (newValue, oldValue) {
            if ($scope.workOrder.wo_equipmentcost < 0) {
                $scope.workOrder.wo_equipmentcost = "";
            }
            if (!isInt($scope.workOrder.wo_equipmentcost)) {
                $scope.workOrder.wo_equipmentcost = "";
            }
            if (angular.isUndefined($scope.workOrder.wo_equipmentcost)) {
                $scope.workOrder.wo_equipmentcost = "";
            }
        });
        $scope.$watch("workOrder.wo_timespent", function (newValue, oldValue) {
            const regex = /^(2[0-3]|[01]?[0-9]):([1-5]{1}[0-9])$/;
            var m = regex.test($scope.workOrder.wo_timespent);
            if (!angular.isUndefined($scope.workOrder.wo_timespent)) {
                console.log(($scope.workOrder.wo_timespent).length);
            }
            if (angular.isUndefined($scope.workOrder.wo_timespent)) {
                $scope.workOrder.wo_timespent = "";
            }
        });
    }]);
var isInt = function (n) {
    return parseInt(n) === n
};
function isNullOrEmptyOrUndefined(value) {
    return !value;
}

var getDateFromDateTime = function(date) {

    date = new Date(date); //Using this we can convert any date format to JS Date

    var mm = date.getMonth() + 1; // getMonth() is zero-based

    var dd = date.getDate();

    if(mm<10){
      mm="0"+mm;
    }
    if(dd<10){
      dd="0"+dd;
    }
    return [date.getFullYear(), mm, dd].join(''); // padding
  };
