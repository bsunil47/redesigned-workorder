'use strict';

angular.module('PGapp.vworkorder', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMaterial', 'dnTimepicker'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_workorder/:id', {
            templateUrl: 'view/vworkorder/vworkorder.html',
            controller: 'VworkorderCtrl'
        });
    }])

    .controller('VworkorderCtrl', ["$scope", "$cookies", "$location", 'API', '$filter', '$routeParams', "$window", 'ngDialog', function ($scope, $cookies, $location, API, $filter, $routeParams, $window, ngDialog) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        $scope.updateWorkOrder = updateWorkOrder;
        var currentId = $routeParams.id;
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            $location.path(reloc);
        };
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
        $scope.workOrderTitle = "View Work Order";
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
            $scope.readOnlyNextPMDate = false;
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
        }
        $scope.checkGoods = false;
        API.GetWorkOrder.Recent({workorder_number: currentId}, function (res) {
            if (res.Code == 200) {

                $scope.workOrder = res.Info.workorder;
                if ($scope.workOrder.status == 2) {
                    $scope.reqPMTask = true;
                }
                if (!angular.isUndefined($scope.workOrder.wo_equipmentcost)) {
                    console.log($scope.workOrder.wo_equipmentcost);
                    $scope.workOrder.wo_equipmentcost = parseInt($scope.workOrder.wo_equipmentcost);
                }

                if (!angular.isUndefined($scope.workOrder.wo_goodsreceipt)) {
                    if ($scope.workOrder.wo_goodsreceipt) {
                        $scope.checkGoods = true;
                    }
                }

                $scope.workOrder.workorder_number = $filter('setPadZeros')($scope.workOrder.workorder_number, 8);


                $scope.workOrder.created_on = $filter('changeStringToDate')($scope.workOrder.created_on);
                if (!angular.isUndefined($scope.workOrder.wo_datecomplete)) {
                    $scope.workOrder.wo_datecomplete = new Date($filter('changeStringToDate')($scope.workOrder.wo_datecomplete));
                    $scope.maxDate = new Date(
                        $scope.workOrder.wo_datecomplete.getFullYear(),
                        $scope.workOrder.wo_datecomplete.getMonth(),
                        $scope.workOrder.wo_datecomplete.getDate());
                }
                //$scope.workOrder.wo_datecomplete = $filter('changeStringToDate')($scope.workOrder.wo_datecomplete);
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
                        $scope.requestor_name = res.Info.user.firstname + " " + res.Info.user.lastname;
                    }
                }, function (error) {
                    alert(error);
                });
                $scope.pmTaskAlreadySet = true;
                if (!angular.isUndefined($scope.workOrder.workorder_PM) && $scope.workOrder.workorder_PM != "") {
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
                            var currentDt = new Date(parseInt($scope.workOrder.wo_pm_date));
                            var mm = currentDt.getMonth() + 1;
                            mm = (mm < 10) ? '0' + mm : mm;
                            var dd = currentDt.getDate();
                            var yyyy = currentDt.getFullYear();
                            var date = mm + '/' + dd + '/' + yyyy;
                            $scope.workOrder.wo_pm_date = $filter('changeStringToDate')($scope.workOrder.wo_pm_date);
                            $scope.workOrder.wo_pm_frequency = res.Info.pm_task.pm_frequency;
                            $scope.workOrder.wo_pm_number = res.Info.pm_task.pm_number;
                            $scope.workOrder.pm_task = 1;
                        }
                    }, function (error) {
                        alert(error);
                    });
                } else {
                    $scope.workOrder.wo_pm_date = "";
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
        API.Status.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {
                $scope.statuses = res.Info.status_list;
                console.log($scope.statuses)
            } else {
            }
        }, function (error) {
            alert(error);
        });
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

        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };

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
            API.GetPMTask.Recent({pm_number: $scope.workOrder.workorder_PM}, function (res) {
                if (res.Code == 200 && $scope.pmTaskAlreadySet) {
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: 'PM Task already in use',
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });
                } else {
                    console.log($scope.reqDateComplete);
                    if (angular.isUndefined($scope.workOrder.wo_datecomplete)) {
                        //$scope.workOrder.wo_datecomplete = new Date();
                    }

                    /*.EditWorkOrderForm.wo_datecomplete.$error.date = true;
                     $scope.EditWorkOrderForm.wo_datecomplete.$error.min = true;
                     $scope.EditWorkOrderForm.wo_datecomplete.$error.max = true;
                     $scope.EditWorkOrderForm.wo_datecomplete.$valid = true;
                     if(!$scope.EditWorkOrderForm.wo_datecomplete.$valid){
                     //$scope.EditWorkOrderForm.$valid = true;
                     }*/

                    console.log($scope.EditWorkOrderForm);
                    console.log($scope.EditWorkOrderForm.$valid);
                    if ($scope.EditWorkOrderForm.$valid && $scope.EditWorkOrderForm.workorder_description.$valid && $scope.EditWorkOrderForm.workorder_skill.$valid && $scope.EditWorkOrderForm.workorder_class.$valid && $scope.EditWorkOrderForm.workorder_technician.$valid) {
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
                    }

                }
            }, function (error) {
                alert(error);
            });
            /*
             if ($scope.EditWorkOrderForm.$valid && $scope.EditWorkOrderForm.workorder_description.$valid && $scope.EditWorkOrderForm.workorder_skill.$valid && $scope.EditWorkOrderForm.workorder_class.$valid && $scope.EditWorkOrderForm.workorder_technician.$valid) {
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
             }
             */


        }

        $scope.showTimeChange = function () {
            if ($scope.workOrder.wo_timespent === "00:00") {
                console.log('asd');
                $scope.workOrder.wo_timespent = 'undefined';
            }
            console.log($scope.workOrder.wo_timespent);
        };
        $scope.showEquipment = showEquipment;
        function showEquipment(equipment) {
            var found = $filter('getByFacilityNumber')('_id', equipment, $scope.equipments);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.equipment_name;
        }

        $scope.showStatus = showStatus;
        function showStatus(status_number) {
            var found = $filter('getByFacilityNumber')('status_number', status_number, status_list);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.status_name;
        }

        $scope.showtechnician = showtechnician;
        function showtechnician(technicain) {
            var found = $filter('getByFacilityNumber')('_id', technicain, $scope.technicians);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.firstname + " " + found.lastname;
        }

        $scope.showSkill = showSkill;
        function showSkill(skill) {
            var found = $filter('getByFacilityNumber')('_id', skill, $scope.skills);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.skill_name;
        }

        $scope.showCategory = showCategory;
        function showCategory(category) {
            var found = $filter('getByFacilityNumber')('_id', category, $scope.categories);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.category_name;
        }

        $scope.showPriority = showPriority;
        function showPriority(priority) {
            var found = $filter('getByFacilityNumber')('_id', priority, $scope.priorities);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.priority_name;
        }

        $scope.showClass = showClass;
        function showClass(cls) {
            var found = $filter('getByFacilityNumber')('_id', cls, $scope.classes);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.class_name;
        }

        $scope.showFacility = showFacility;
        function showFacility(facility_number) {
            var found = $filter('getByFacilityNumber')('facility_number', facility_number, $scope.facilities);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            console.log(found);
            return found.facility_name;
        }

        $scope.showRequestor = showRequestor;
        function showRequestor(user) {
            var found = $filter('getByFacilityNumber')('_id', user, $scope.requestors);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.firstname + " " + found.lastname;
        }

        $scope.showWithzeros = showWithzeros;
        function showWithzeros(Order) {
            return $filter('setPadZeros')(Order, 8);
        }

        $scope.goPrint = function (workorder_id) {
            workorder_id = parseInt(workorder_id);
            $location.path('print_workorder/' + workorder_id);
        };
    }]);