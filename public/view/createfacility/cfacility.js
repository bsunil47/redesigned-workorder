'use strict';

angular.module('PGapp.createfacility', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_facility', {
            templateUrl: 'view/createfacility/create_facility.html',
            controller: 'CreateFacilityCtrl'
        });
    }])

    .controller('CreateFacilityCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
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

        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        $scope.CreateFacility = CreateFacility;
        $scope.facility = {
            facility_number: "",
            facility_name: ""
        };
        $scope.disableSubmit = false;
        function CreateFacility() {
            $scope.disableSubmit = true;
            if ($scope.CreateFacilityForm.facility_name.$valid && $scope.CreateFacilityForm.facility_number.$valid) {
                $scope.facility_id = API.CreateFacility.Facility($scope.facility, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/facilities");
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
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: 'Oops try after sometime',
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });
                    $scope.disableSubmit = false;
                });
            } else {
                $scope.disableSubmit = false;
            }
        }

        $scope.clearForm = function () {
            $scope.facility = {};
        };
    }]);