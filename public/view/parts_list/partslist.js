'use strict';

angular.module('PGapp.partslist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/parts_list', {
            templateUrl: 'view/parts_list/partslist.html',
            controller: 'PlistCtrl'
        });
    }])
    .controller('PlistCtrl', ["$scope", "$cookies", "$location", "$filter", "$window", 'API', function ($scope, $cookies, $location, $filter, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                //$window.history.back();
                $location.path(reloc);
            } else {
                $location.path("/");
            }
        };
        API.SFacilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.user_facility = res.Info.facilities[0].facility_number;
                //$cookies.put('userDetails',res)
                API.SEquipment.Recent({facility_number: $scope.user_facility}, function (res) {
                    if (res.Code == 200) {
                        $scope.equipments = res.Info.equipments;
                        //$cookies.put('userDetails',res)
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

        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        $scope.$watch("equipment_number", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.equipment_number)) {
                var found = $filter('getByFacilityNumber')('equipment_number', $scope.equipment_number, $scope.equipments);
                if (angular.isUndefined(found) || found === null) {
                    return null;
                }
                $scope.parts = found.equipments;
            }
        });
        $scope.p = [];
        $scope.disableSubmit = false;
        $scope.createPartRequest = function (part) {
            $scope.disableSubmit = true;
            if (!angular.isUndefined($scope.p.qty)) {
                if ($scope.p.qty[part.material_number + part.vendor_number] >= part.min_qty && $scope.p.qty[part.material_number + part.vendor_number] <= part.max_qty) {
                    var set = {
                        facility_number: $scope.user_facility,
                        equipment_number: $scope.equipment_number,
                        material_number: part.material_number,
                        vendor_number: part.vendor_number,
                        qty: $scope.p.qty[part.material_number + part.vendor_number],
                        user_id: userdetail.user._id,
                    };
                    console.log($scope.p.workorder);
                    if (!angular.isUndefined($scope.p.workorder)) {
                        set.workorder_number = parseInt($scope.p.workorder[part.material_number + part.vendor_number]);
                    }
                    API.CreatePartsRequest.Recent(set, function (res) {
                        if (res.Code == 200) {
                            $scope.p.qty[part] = "";
                            if (!angular.isUndefined($scope.p.workorder)) {
                                $scope.p.workorder[part] = "";
                            }
                            swal({
                                title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                                text: res.Info,
                                width: "450px",
                                confirmButtonText: 'Ok'
                            });
                            $scope.disableSubmit = false;
                            $scope.p.qty[part.material_number + part.vendor_number] = "";
                            if (!angular.isUndefined($scope.p.workorder)) {
                                $scope.p.workorder[part.material_number + part.vendor_number] = "";
                            }
                            $location.path("/parts_list");

                        } else {
                            swal({
                                title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                                text: res.Info,
                                width: "450px",
                                confirmButtonText: 'Ok'
                            });
                            $scope.disableSubmit = false;
                            //$scope.CreateUserForm.email.error = true;
                        }
                    }, function (error) {
                        alert(error);
                    });

                } else {
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: "Qty should be between min and max values",
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });
                }
                $scope.disableSubmit = false;
            } else {
                swal({
                    title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                    text: "Qty should be between min and max values",
                    width: "450px",
                    confirmButtonText: 'Ok'
                });
                $scope.disableSubmit = false;
            }

        }
    }]);