'use strict';

angular.module('PGapp.sorders', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_workorder', {
            templateUrl: 'view/search_orders/sorders.html',
            controller: 'SordersCtrl'
        });
    }])

    .controller('SordersCtrl', ["$scope", "$cookies", "$location", '$filter', 'API', function ($scope, $cookies, $location, $filter, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        $scope.workOrder = {};
        /*$scope.workOrder = {
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
            wo_datecomplete: "",
            workorder_description: "",
            workorder_leadcomments: "",
            workorder_actiontaken: "",
            wo_pm_number: "",
         };*/
        var userdetail = $cookies.getObject('userDetails');
        $scope.facilities = $cookies.getObject('facilities');
        $scope.selected_facility = $scope.facilities[0].facility_number;
        API.Equipments.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {
                $scope.equipments = res.Info.equipments;
            } else {

            }

        }, function (error) {
            alert(error);
        });
        $scope.ListWorkOrders = ListWorkOrders;
        ListWorkOrders();

        $scope.facilities = $cookies.getObject('facilities');
        //$scope.workOrder.workorder_facility = $scope.facilities[0].facility_number;

        //$scope.workOrder= $scope.facilities[0].facility_number;
        //console.log($scope.facilities);
        $scope.selected_facility = $scope.facilities[0].facility_number;
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
        API.GetUserByType.Recent({facility_number: $scope.selected_facility}, function (res) {
            if (res.Code == 200) {
                $scope.technicians = res.Info.users;
            } else {
            }
        }, function (error) {
            alert(error);
        });
        API.UserRole.Recent({role_name: 'technician'}, function (res) {
            if (res.Code == 200) {
                var qry = {userrole: res.Info.user_role._id};
                console.log(qry);
                API.GetUsers.Recent(qry, function (res) {
                    if (res.Code == 200) {
                        $scope.technicians = res.Info.users;
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
        $scope.editWorkOrder = function (workorder_id) {
            $location.path('edit_workorder/' + workorder_id);
        };
        $scope.viewWorkOrder = function (workorder_id) {
            $location.path('view_workorder/' + workorder_id);
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
            if (status == 2 && userdetail.role == 'technician') {
                return false;
            } else {
                return true;
            }
        }

        function ListWorkOrders() {
            if (angular.isUndefined($scope.workOrder.workorder_priority) && angular.isUndefined($scope.workOrder.workorder_number) && angular.isUndefined($scope.workOrder.workorder_category) && angular.isUndefined($scope.workOrder.workorder_skill) && angular.isUndefined($scope.workOrder.workorder_creator) && angular.isUndefined($scope.workOrder.workorder_technician) && angular.isUndefined($scope.workOrder.workorder_equipment) && angular.isUndefined($scope.workOrder.workorder_facility) && angular.isUndefined($scope.workOrder.workorder_status) && angular.isUndefined($scope.workOrder.created_on_from) && angular.isUndefined($scope.workOrder.created_on_to) && angular.isUndefined($scope.workOrder.wo_datecomplete_from) && angular.isUndefined($scope.workOrder.wo_datecomplete_to) && angular.isUndefined($scope.workOrder.wo_pm_date_from) && angular.isUndefined($scope.workOrder.wo_pm_date_to) && angular.isUndefined($scope.workOrder.workorder_class)) {
                //if(){
                var qry = userdetail.user;
                API.ManageWorkorders.Recent(qry, function (res) {
                    if (res.Code == 200) {
                        $scope.workOrders = res.Info.workorders;
                    } else {

                    }

                }, function (error) {
                    alert(error);
                });

            } else {
                var qry = {};
                for (var i in $scope.workOrder) {
                    if (!isNullOrEmptyOrUndefined($scope.workOrder[i])) {
                        qry[i] = $scope.workOrder[i];
                    }
                }
                //var qry = $scope.workOrder;
                API.GetSearchedWorkOrders.Recent(qry, function (res) {
                    if (res.Code == 200) {
                        $scope.workOrders = res.Info.workorders;
                    } else {

                    }

                }, function (error) {
                    alert(error);
                });

            }


        }

        $scope.clearForm = function () {
            $scope.workOrder = {};
        }

        function isNullOrEmptyOrUndefined(value) {
            return !value;
        }

    }]);