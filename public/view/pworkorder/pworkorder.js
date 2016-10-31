'use strict';

angular.module('PGapp.workorder', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMaterial', 'dnTimepicker'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/print_workorder/:id', {
            templateUrl: 'view/pworkorder/pworkorder.html',
            controller: 'PworkorderCtrl'
        });
    }])

    .controller('PworkorderCtrl', ["$scope", "$cookies", "$location", 'API', '$filter', '$routeParams', 'ngDialog', '$window', function ($scope, $cookies, $location, API, $filter, $routeParams, ngDialog, $window) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var currentId = $routeParams.id;
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
                $location.path("/");
        };
        $scope.facilities = $cookies.getObject('facilities');
        //$scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;

        //$scope.workOrder= $scope.facilities[0].facility_number;
        //console.log($scope.facilities);
        API.Equipments.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {
                $scope.equipments = res.Info.equipments;
            } else {

            }

        }, function (error) {
            alert(error);
        });
        API.Categories.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.categories = res.Info.categories;


                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });
        API.Priorities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {
                $scope.priorities = res.Info.priorities;
                //$cookies.put('userDetails',res)
            } else {
            }
        }, function (error) {
            alert(error);
        });
        API.Skills.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {
                $scope.skills = res.Info.skills;
                //$cookies.put('userDetails',res)
            } else {
            }
        }, function (error) {
            alert(error);
        });
        API.Classes.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {
                $scope.classes = res.Info.classes;
            } else {
            }
        }, function (error) {
            alert(error);
        });
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

        API.GetWorkOrder.Recent({workorder_number: currentId}, function (res) {
            if (res.Code == 200) {

                $scope.workOrder = res.Info.workorder;
                if ($scope.workOrder.status == 2) {
                    $scope.reqPMTask = true;
                }
                if (!angular.isUndefined($scope.workOrder.wo_equipmentcost) && $scope.workOrder.wo_equipmentcost != "") {
                    console.log($scope.workOrder.wo_equipmentcost);
                    $scope.workOrder.wo_equipmentcost = parseInt($scope.workOrder.wo_equipmentcost);
                } else {
                    $scope.workOrder.wo_equipmentcost = "";
                }

                $scope.workOrder.workorder_number = $filter('setPadZeros')($scope.workOrder.workorder_number, 8);
                $scope.workOrder.workorder_facility = showFacility($scope.workOrder.workorder_facility);
                $scope.workOrder.workorder_category = showCategory($scope.workOrder.workorder_category);
                API.Status.Recent({facility_number: $scope.selected_facility}, function (res) {
                    if (res.Code == 200) {
                        $scope.statuses = res.Info.status_list;
                        $scope.workOrder.status = showStatus($scope.workOrder.status);
                    } else {
                    }
                }, function (error) {
                    alert(error);
                });

                $scope.workOrder.workorder_skill = showSkill($scope.workOrder.workorder_skill);
                $scope.workOrder.workorder_class = showClass($scope.workOrder.workorder_class);
                API.UserRole.Recent({role_name: 'technician'}, function (res) {
                    if (res.Code == 200) {
                        var qry = {userrole: res.Info.user_role._id};
                        console.log(qry);
                        API.GetUsers.Recent(qry, function (res) {
                            if (res.Code == 200) {
                                $scope.technicians = res.Info.users;
                                $scope.workOrder.workorder_technician = showtechnician($scope.workOrder.workorder_technician);
                            } else {
                            }
                        }, function (error) {
                            alert(error);
                        });
                    } else {
                    }
                }, function (error) {
                    alert(error);
                });
                API.UserRole.Recent({role_name: 'operator'}, function (res) {
                    if (res.Code == 200) {
                        var qry = {userrole: res.Info.user_role._id};
                        console.log(qry);
                        API.GetUsers.Recent(qry, function (res) {
                            if (res.Code == 200) {
                                $scope.requestors = res.Info.users;
                                $scope.workOrder.workorder_creator = showRequestor($scope.workOrder.workorder_creator);
                            } else {
                            }
                        }, function (error) {
                            alert(error);
                        });
                    } else {
                    }
                }, function (error) {
                    alert(error);
                });
                $scope.workOrder.workorder_equipment = showEquipment($scope.workOrder.workorder_equipment);
                $scope.workOrder.created_on = $filter('changeStringToDate')($scope.workOrder.created_on);
                $scope.selected_facility = $scope.workOrder.workorder_facility;

                if (!angular.isUndefined($scope.workOrder.wo_datecomplete)) {
                    $scope.workOrder.wo_datecomplete = $filter('changeStringToDate')($scope.workOrder.wo_datecomplete);
                }
                if (!angular.isUndefined($scope.workOrder.wo_pm_date) && $scope.workOrder.wo_pm_date != "") {
                    if (!isNaN(parseInt($scope.workOrder.wo_pm_date))) {
                        $scope.workOrder.wo_pm_date = $filter('changeStringToDate')($scope.workOrder.wo_pm_date);
                    } else {
                        $scope.workOrder.wo_pm_date = "";
                    }
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


        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };

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
            return found.firstname;
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
            return found.firstname;
        }

        $scope.showWithzeros = showWithzeros;
        function showWithzeros(Order) {
            return $filter('setPadZeros')(Order, 8);
        }
    }]);