'use strict';

angular.module('PGapp.editequipment', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editequipment/:id', {
            templateUrl: 'view/editequipment/edit_equipment.html',
            controller: 'EditEquipmentCtrl'
        });
    }])

    .controller('EditEquipmentCtrl', ["$scope", "$cookies", "$location", "$routeParams", "$filter", "$window", 'API', function ($scope, $cookies, $location, $routeParams, $filter, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                $location.path(reloc);
            } else {
                $location.path("/");
            }
        };
        var edit_equipment_id = $routeParams.id;
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

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        $scope.EditEquipment = EditEquipment;
        $scope.equipment = {
            _id: edit_equipment_id,
            facility_number: "",
            equipment_name: "",
            equipment_number: "",

            //equipment_vendor_name: ""
        };
        var facilities = $cookies.getObject('facilities');
        // $scope.showFacility = function (facility_number) {
        //     var facilities_numbers = "";
        //     var facility_length = facility_number.length;

        //     for (var faci in facility_number) {
        //         var found = $filter('getByFacilityNumber')('facility_number', facility_number[faci].facility_number, facilities);
        //         if (angular.isUndefined(found) || found === null) {
        //             facilities_numbers = facilities_numbers
        //         } else {
        //             if (facility_length - 1 <= faci) {
        //                 facilities_numbers = facilities_numbers + found.facility_name;
        //             } else {
        //                 facilities_numbers = facilities_numbers + found.facility_name + ", ";
        //             }
        //         }
        //     }
        //     return facilities_numbers;
        // };
        API.GetEquipment.Recent({_id: edit_equipment_id}, function (res) {
            if (res.Code == 200) {
                console.log("Get Facility: " + JSON.stringify(res.Info.equipment));
                $scope.equipment = res.Info.equipment;
            }
        }, function (error) {
            alert(error);

        });
        function EditEquipment() {
            if (!$cookies.get('userDetails')) {
                $location.path('login');
            }
            console.log($scope.equipment);
            if ($scope.EditEquipmentForm.equipment_name.$valid) {
                API.EditEquipment.Equipment($scope.equipment, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: "Equipment details updated",
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/equipments");
                    } else {
                        //$scope.CreateUserForm.email.error = true;
                        $location.path("/equipments");
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }
    }]);