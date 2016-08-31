'use strict';

angular.module('PGapp.createfacility', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_facility', {
            templateUrl: 'view/createfacility/create_facility.html',
            controller: 'CreateFacilityCtrl'
        });
    }])

    .controller('CreateFacilityCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
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