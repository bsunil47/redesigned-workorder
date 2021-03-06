'use strict';

angular.module('PGapp.createstatus', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_status', {
            templateUrl: 'view/createstatus/create_status.html',
            controller: 'CreateStatusCtrl'
        });
    }])

    .controller('CreateStatusCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
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
        $scope.CreateStatus = CreateStatus;
        $scope.status = {
            facility_number: "",
            status_name: ""
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
        function CreateStatus() {
            if (!$cookies.get('userDetails')) {
                $location.path('login');
            }
            $scope.disableSubmit = true;
            if ($scope.CreateStatusForm.status_name.$valid && $scope.CreateStatusForm.facility_number.$valid) {
                $scope.status_id = API.CreateStatus.Status($scope.status, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/status");
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
            $scope.status = {};
        };
    }]);