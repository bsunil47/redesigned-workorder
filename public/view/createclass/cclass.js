'use strict';

angular.module('PGapp.createclass', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_class', {
            templateUrl: 'view/createclass/create_class.html',
            controller: 'CreateClassCtrl'
        });
    }])

    .controller('CreateClassCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        $scope.CreateClass = CreateClass;
        $scope.class = {
            class_name: "",
            facility_number: ""
        };
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
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
            } else {

            }

        }, function (error) {
            alert(error);
        });
        $scope.disableSubmit = false;
        function CreateClass() {
            if (!$cookies.get('userDetails')) {
                $location.path('login');
            }
            $scope.disableSubmit = true;
            if ($scope.CreateClassForm.class_name.$valid && $scope.CreateClassForm.facility_number.$valid) {

                $scope.class_id = API.CreateClass.Class($scope.class, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/classes");
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
            $scope.class = {};
        };
    }]);