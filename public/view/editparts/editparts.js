'use strict';

angular.module('PGapp.editparts', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editparts/:id', {
            templateUrl: 'view/editparts/edit_parts.html',
            controller: 'EditPartsCtrl'
        });
    }])

    .controller('EditPartsCtrl', ["$scope", "$cookies", "$location", "$filter", "$routeParams", "$window", 'API', function ($scope, $cookies, $location, $filter, $routeParams, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }

        var edit_part_number = $routeParams.id;
        $scope.ep = {
            equipment_name: "",
            equipment_number: "",
            material_number: "",
            material_name: "",
            vendor_number: "",
            vendor_name: "",
            min_qty: "",
            max_qty: ""
        };
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                $window.history.back();
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
        API.GetParts.Recent({part_number: edit_part_number}, function (res) {
            if (res.Code == 200) {
                console.log("Get Parts: " + JSON.stringify(res.Info.equipment));
                $scope.ep = res.Info.equipment;

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
        $scope.EditParts = EditParts;

        function EditParts() {

            console.log($scope.ep.equipment_name);
            console.log("Equipments in ep: " + JSON.stringify($scope.ep));
            if ($scope.EditPartsForm.min_qty.$valid && $scope.EditPartsForm.max_qty.$valid) {

                if (parseInt($scope.EditPartsForm.min_qty, 10) > parseInt($scope.EditPartsForm.max_qty, 10)) {
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: "Invalid Details",
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });
                    $location.path("/partsequipmentlist");
                }

                $scope.ep.material_number = $scope.ep.equipments.material_number;
                $scope.ep.min_qty = $scope.ep.equipments.min_qty;
                $scope.ep.max_qty = $scope.ep.equipments.max_qty;

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
            else {
                console.log("edit parts if condition failed");
                swal({
                    title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                    text: "Invalid Details",
                    width: "450px",
                    confirmButtonText: 'Ok'
                });
                $location.path("/partsequipmentlist");
            }
        }

        // $scope.eqchange = function () {
        //     if ($scope.CreatePartsForm.equipment_number.$valid) {
        //         console.log("EQ Numberin eqchange: " + $scope.ep.equipment_number);
        //         API.Equipmentname.Recent($scope.ep, function (res) {
        //             //API.Equipmentname.Recent(JSON.stringify($scope.pe.equipment_number), function (res) {
        //             if (res.Code == 200) {
        //                 console.log("EName: " + JSON.stringify(res.Info.equipmentname));
        //                 console.log("EName: " + JSON.stringify(res.Info.equipmentname[0]));
        //                 $scope.ep.equipment_name = res.Info.equipmentname[0].equipment_name;
        //             } else {

        //             }

        //         }, function (error) {
        //             alert(error);
        //         });
        //     }
        // }
        // $scope.$watch("ep.equipment_number", function (newValue, oldValue) {
        //     if (!angular.isUndefined($scope.ep.equipment_number)) {
        //         var found = $filter('getByFacilityNumber')('equipment_number', $scope.ep.equipment_number, $scope.partsequipments);
        //         if (angular.isUndefined(found) || found === null) {
        //             return null;
        //         }
        //         $scope.ep.equipment_name = found.equipment_name;
        //     }
        // });

    }]);