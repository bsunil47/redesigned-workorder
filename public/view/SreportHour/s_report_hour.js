'use strict';

angular.module('PGapp.searchreporthour', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_report_hour', {
            templateUrl: 'view/SreportHour/s_report_hour.html',
            controller: 'SreportHour'
        });
    }])

    .controller('SreportHour', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
        $scope.CreateUser = CreateUser;
        $scope.user = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            userrole: '',
            status: 1,
            password: ''
        };

        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
            } else {

            }

        }, function (error) {
            alert(error);
        });


        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };

        function CreateUser() {
            $scope.user.username = $scope.user.firstname + ' ' + $scope.user.lastname;
            $scope.user._v = 0;
            if ($scope.CreateUserForm.firstname.$valid && $scope.CreateUserForm.lastname.$valid) {
                $scope.user_id = API.Create.User($scope.user, function (res) {
                    if (res.Code == 200) {
                        $location.path("/users");
                    } else {
                        $scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        }
    }]);