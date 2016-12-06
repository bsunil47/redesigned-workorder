'use strict';

angular.module('PGapp.sorders', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngDialog'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_workorder', {
            templateUrl: 'view/search_orders/sorders.html',
            controller: 'SordersCtrl'
        });
    }])

    .controller('SordersCtrl', ["$scope", "$cookies", "$location", '$filter', '$window', 'API', 'ngDialog', function ($scope, $cookies, $location, $filter, $window, API, ngDialog) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        $scope.workOrder = {};
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                $location.path(reloc);
            } else {
                $location.path("/");
            }
        };
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
        $scope.clickToOpen = function (wokorder) {
            if (!$cookies.get('userDetails')) {
                $location.path('login');
            }
            $scope.selectedWorkOrder = wokorder;
            $scope.selectedWorkOrder.workorder_number = showWithzeros($scope.selectedWorkOrder.workorder_number);
            $scope.selectedWorkOrder.workorder_equipment = showEquipment($scope.selectedWorkOrder.workorder_equipment);
            $scope.selectedWorkOrder.status = showStatus($scope.selectedWorkOrder.status);
            $scope.selectedWorkOrder.workorder_technician = showtechnician($scope.selectedWorkOrder.workorder_technician);
            console.log($scope.selectedWorkOrder.created_on);
            if (isNaN(parseInt($scope.selectedWorkOrder.created_on))) {
                var currentDt = $scope.selectedWorkOrder.created_on;
            } else {
                var currentDt = new Date(parseInt($scope.selectedWorkOrder.created_on));
            }
            var mm = currentDt.getMonth() + 1;
            mm = (mm < 10) ? '0' + mm : mm;
            var dd = currentDt.getDate();
            var yyyy = currentDt.getFullYear();
            var date_on = mm + '/' + dd + '/' + yyyy;
            $scope.selectedWorkOrder.created_on = date_on;
            if (!angular.isUndefined($scope.selectedWorkOrder.wo_datecomplete)) {
                var currentDt = new Date(parseInt($scope.selectedWorkOrder.wo_datecomplete));
                console.log(currentDt);
                var mm = currentDt.getMonth() + 1;
                mm = (mm < 10) ? '0' + mm : mm;
                var dd = currentDt.getDate();
                var yyyy = currentDt.getFullYear();
                var date = mm + '/' + dd + '/' + yyyy;
                $scope.selectedWorkOrder.wo_datecomplete = date;
            }

            $scope.selectedWorkOrder.workorder_skill = showSkill($scope.selectedWorkOrder.workorder_skill);
            $scope.selectedWorkOrder.workorder_category = showCategory($scope.selectedWorkOrder.workorder_category);
            $scope.selectedWorkOrder.workorder_priority = showPriority($scope.selectedWorkOrder.workorder_priority);
            $scope.selectedWorkOrder.workorder_class = showClass($scope.selectedWorkOrder.workorder_class);
            if (!angular.isUndefined($scope.selectedWorkOrder.wo_pm_date)) {
                var currentDt = new Date(parseInt($scope.selectedWorkOrder.wo_pm_date));
                var mm = currentDt.getMonth() + 1;
                mm = (mm < 10) ? '0' + mm : mm;
                var dd = currentDt.getDate();
                var yyyy = currentDt.getFullYear();
                var date = mm + '/' + dd + '/' + yyyy;
                $scope.selectedWorkOrder.wo_pm_date = date;
            }
            $scope.selectedWorkOrder.workorder_facility = showFacility($scope.selectedWorkOrder.workorder_facility);
            $scope.selectedWorkOrder.workorder_creator = showRequestor($scope.selectedWorkOrder.workorder_creator);
            console.log($scope.selectedWorkOrder.created_on);
            console.log($scope.workOrder.workorder_number);
            console.log(wokorder);
            console.log($scope.selectedWorkOrder);
            ngDialog.open({
                template: 'view/popup/popupTmpl.html',
                className: 'ngdialog-theme-default',
                controller: ['$scope', 'API', function ($scope, API) {
                    // controller logic
                }]
            });
            //ngDialog.open({template: 'view/popup/popupTmpl.html', className: 'ngdialog-theme-default', scope: $scope.selectedWorkOrder});
            console.log($scope.workOrder.workorder_number);
            console.log(wokorder);
            console.log($scope.selectedWorkOrder);
        };
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
        };
        $scope.showWithzeros = showWithzeros;
        function showWithzeros(Order) {
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
        $scope.showEdit = function (status) {
            if (status.status == 2 && (userdetail.role == 'technician' || userdetail.role == 'clerk')) {
                return false;
            } else {
                if (status.workorder_technician != userdetail.user._id && userdetail.role == 'technician') {
                    return false;
                } else {
                    return true;
                }
            }
        };

        function ListWorkOrders() {
            if (!$cookies.get('userDetails')) {
                $location.path('login');
            }
            if (angular.isUndefined($scope.workOrder.workorder_priority) && angular.isUndefined($scope.workOrder.workorder_number) && angular.isUndefined($scope.workOrder.workorder_category) && angular.isUndefined($scope.workOrder.workorder_skill) && angular.isUndefined($scope.workOrder.workorder_creator) && angular.isUndefined($scope.workOrder.workorder_technician) && angular.isUndefined($scope.workOrder.workorder_equipment) && angular.isUndefined($scope.workOrder.workorder_facility) && angular.isUndefined($scope.workOrder.status) && angular.isUndefined($scope.workOrder.created_on_from) && angular.isUndefined($scope.workOrder.created_on_to) && angular.isUndefined($scope.workOrder.wo_datecomplete_from) && angular.isUndefined($scope.workOrder.wo_datecomplete_to) && angular.isUndefined($scope.workOrder.wo_pm_date_from) && angular.isUndefined($scope.workOrder.wo_pm_date_to) && angular.isUndefined($scope.workOrder.workorder_class) && angular.isUndefined($scope.workOrder.workorder_PM)) {
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
                qry.userrole = userdetail.user.userrole;
                qry.user_id = userdetail.user._id;
                qry.role = userdetail.role;
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
        };

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

        function isNullOrEmptyOrUndefined(value) {
            return !value;
        }

        $scope.goPrint = function (workorder_id) {
            $location.path('print_workorder/' + workorder_id);
        };

    }]);