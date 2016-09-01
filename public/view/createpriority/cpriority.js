'use strict';

angular.module('PGapp.createpriority', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_priority', {
            templateUrl: 'view/createpriority/create_priority.html',
            controller: 'CreatePriorityCtrl'
        });
    }])

    .controller('CreatePriorityCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');

        $scope.Logout = function () {
            $cookies.remove('userDetails')
            $location.path("/");
        }

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        }
        $scope.CreatePriority = CreatePriority;
        $scope.priority = {
            facility_number: "",
            priority_name: ""
        };
        function CreatePriority() {
            if ($scope.CreatePriorityForm.priority_name.$valid && $scope.CreatePriorityForm.facility_number.$valid) {
                $scope.priority_id = API.CreatePriority.Priority($scope.priority, function (res) {
                    if (res.Code == 200) {
                        $location.path("/priorities");
                    } else {
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }
    }]);