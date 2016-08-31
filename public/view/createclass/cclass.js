'use strict';

angular.module('PGapp.createclass', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_class', {
            templateUrl: 'view/createclass/create_class.html',
            controller: 'CreateClassCtrl'
        });
    }])

    .controller('CreateClassCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
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
    }]);