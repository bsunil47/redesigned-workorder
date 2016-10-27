'use strict';

angular.module('PGapp.createequipment', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_equipment', {
            templateUrl: 'view/createequipment/create_equipment.html',
            controller: 'CreateEquipmentCtrl'
        });
    }])

    .controller('CreateEquipmentCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager') {
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

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        $scope.CreateEquipment = CreateEquipment;
        $scope.equipment = {
            facility_number: "",
            equipment_name: "",
            equipment_number: ""
            //equipment_vendor_name: ""
        };
        function CreateEquipment() {
            console.log($scope.equipment);
            if ($scope.CreateEquipmentForm.equipment_name.$valid && $scope.CreateEquipmentForm.facility_number.$valid) {
                $scope.equipment_id = API.CreateEquipment.Equipment($scope.equipment, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/equipments");
                    } else {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: 'Oops try after sometime',
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });
                });
            }
        }

        $scope.clearForm = function () {
            $scope.equipment = {};
        };
    }]);