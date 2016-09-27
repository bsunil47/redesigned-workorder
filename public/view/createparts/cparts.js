'use strict';

angular.module('PGapp.createparts', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/createparts', {
            templateUrl: 'view/createparts/createparts.html',
            controller: 'CreatePartsCtrl'
        });
    }])

    .controller('CreatePartsCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        $scope.pe = {
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
        $scope.CreateParts = CreateParts;

        function CreateParts() {

            console.log($scope.pe.equipment_name);
            console.log("Equipments: " + JSON.stringify($scope.pe));
            if ($scope.CreatePartsForm.equipment_name.$valid && $scope.CreatePartsForm.equipment_number.$valid) {
                $scope.equipment_id = API.CreateParts.Equipment($scope.pe, function (res) {
                    if (res.Code == 200) {
                        $location.path("/partsequipmentlist");
                    } else {
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }

        $scope.eqchange = function () {
            if ($scope.CreatePartsForm.equipment_number.$valid) {
                console.log("EQ Numberin eqchange: " + $scope.pe.equipment_number);
                API.Equipmentname.Recent($scope.pe, function (res) {
                    //API.Equipmentname.Recent(JSON.stringify($scope.pe.equipment_number), function (res) {
                    if (res.Code == 200) {
                        console.log("EName: " + JSON.stringify(res.Info.equipmentname));
                        console.log("EName: " + JSON.stringify(res.Info.equipmentname[0]));
                        $scope.pe.equipment_name = res.Info.equipmentname[0].equipment_name;
                    } else {

                    }

                }, function (error) {
                    alert(error);
                });
            }
        };
        $scope.$watch("pe.equipment_number", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.pe.equipment_number)) {
                var found = $filter('getByFacilityNumber')('equipment_number', $scope.pe.equipment_number, $scope.partsequipments);
                if (angular.isUndefined(found) || found === null) {
                    return null;
                }
                $scope.pe.equipment_name = found.equipment_name;
            }
        });

    }]);