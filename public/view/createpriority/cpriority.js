'use strict';

angular.module('PGapp.createpriority', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_priority', {
            templateUrl: 'view/createpriority/create_priority.html',
            controller: 'CreatePriorityCtrl'
        });
    }])

    .controller('CreatePriorityCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.$on('$locationChangeStart', function (event, next, current) {
            // Here you can take the control and call your own functions:
            ///alert('Sorry ! Back Button is disabled');
            // Prevent the browser default action (Going back):
            if (userdetail.role == 'manager') {
                $window.history.back();
            } else {
                $location.path("/");
            }
            event.preventDefault();
        });
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

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        $scope.CreatePriority = CreatePriority;
        $scope.priority = {
            facility_number: "",
            priority_name: ""
        };
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
            } else {

            }

        }, function (error) {
            alert(error);
        });
        function CreatePriority() {
            if ($scope.CreatePriorityForm.priority_name.$valid && $scope.CreatePriorityForm.facility_number.$valid) {
                $scope.priority_id = API.CreatePriority.Priority($scope.priority, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/priorities");
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
            $scope.priority = {};
        };
    }]);