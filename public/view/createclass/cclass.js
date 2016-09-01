'use strict';

angular.module('PGapp.createclass', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_class', {
            templateUrl: 'view/createclass/create_class.html',
            controller: 'CreateClassCtrl'
        });
    }])

    .controller('CreateClassCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
        $scope.CreateClass = CreateClass;
        $scope.class = {
            class_name: "",
            facility_number: ""
        }
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
        function CreateClass() {
            if ($scope.CreateClassForm.class_name.$valid && $scope.CreateClassForm.facility_number.$valid) {
                $scope.class_id = API.CreateClass.Class($scope.class, function (res) {
                    if (res.Code == 200) {
                        $location.path("/classes");
                    } else {
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }
    }]);