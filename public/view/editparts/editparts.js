'use strict';

angular.module('PGapp.editparts', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editparts/:id/:id1/:id2', {
            templateUrl: 'view/editparts/edit_parts.html',
            controller: 'EditPartsCtrl'
        });
    }])

    .controller('EditPartsCtrl', ["$scope", "$cookies", "$location", "$filter", "$routeParams", "$window", 'API', function ($scope, $cookies, $location, $filter, $routeParams, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }

        var edit_part_number = $routeParams.id;
        var edit_vendor_number = $routeParams.id1;
        var edit_facility_number = $routeParams.id2;
        $scope.ep = {
            equipment_name: "",
            equipment_number: "",
            material_number: "",
            material_name: "",
            vendor_number: "",
            vendor_name: "",
            min_qty: 0,
            max_qty: 0
        };
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                $location.path(reloc);
            } else {
                $location.path("/");
            }
        };

        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };

        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
            } else {

            }

        }, function (error) {
            alert(error);
        });
        $scope.disVendorName = true;
        API.GetParts.Recent({
            part_number: edit_part_number,
            vendor_number: edit_vendor_number,
            facility_number: edit_facility_number
        }, function (res) {
            if (res.Code == 200) {
                console.log("Get Parts: " + JSON.stringify(res.Info.equipment));
                $scope.ep = res.Info.equipment;
                $scope.ep.equipments.max_qty = parseInt($scope.ep.equipments.max_qty);
                $scope.ep.equipments.min_qty = parseInt($scope.ep.equipments.min_qty);
                $scope.min_qty = parseInt($scope.ep.equipments.min_qty) + 1;
                $scope.max_qty = parseInt($scope.ep.equipments.max_qty) - 1;

            }
        }, function (error) {
            alert(error);

        });

        API.Partsequipments.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.partsequipments = res.Info.partsequipments;
            } else {

            }

        }, function (error) {
            alert(error);
        });
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };

        $scope.$watch("ep.equipments.max_qty", function (newValue, oldValue) {
            if (!isInt($scope.ep.equipments.max_qty)) {
                $scope.ep.equipments.max_qty = oldValue;
            } else {
                $scope.max_qty = parseInt($scope.ep.equipments.max_qty) - 1;
            }
        });
        $scope.$watch("ep.equipments.min_qty", function (newValue, oldValue) {
            if (!isInt($scope.ep.equipments.min_qty)) {
                $scope.ep.equipments.min_qty = oldValue;
            } else {
                $scope.min_qty = parseInt($scope.ep.equipments.min_qty) + 1;
            }
        });
        $scope.EditParts = EditParts;

        function EditParts() {

            console.log($scope.ep.equipment_name);
            console.log("Equipments in ep: " + JSON.stringify($scope.ep));
            if ($scope.EditPartsForm.min_qty.$valid && $scope.EditPartsForm.max_qty.$valid) {

                if (parseInt($scope.EditPartsForm.min_qty, 10) > parseInt($scope.EditPartsForm.max_qty, 10)) {
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: "Min Qty cant be greater than Max Qty",
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });

                } else {
                    $scope.ep.vendor_number = $scope.ep.equipments.vendor_number;
                    $scope.ep.material_number = $scope.ep.equipments.material_number;
                    $scope.ep.min_qty = $scope.ep.equipments.min_qty;
                    $scope.ep.max_qty = $scope.ep.equipments.max_qty;
                    $scope.ep.facility_number = edit_facility_number;

                    API.EditParts.Equipment($scope.ep, function (res) {
                        if (res.Code == 200) {
                            swal({
                                title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                                text: "Parts details updated",
                                width: "450px",
                                confirmButtonText: 'Ok'
                            });
                            $location.path("/partsequipmentlist");
                        } else {
                            //$scope.CreateUserForm.email.error = true;
                            $location.path("/partsequipmentlist");
                        }
                    }, function (error) {
                        alert(error);
                    });
                }

            }
            else {
                /* swal({
                    title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                 text: "Min Qty cant be greater than Max Qty",
                    width: "450px",
                    confirmButtonText: 'Ok'
                 });*/
            }
        }

    }]);