'use strict';

angular.module('PGapp.facilitylist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/facilities', {
            templateUrl: 'view/facilitiylist/facilitylist.html',
            controller: 'FacilityListCtrl'
        });
    }])

    .controller('FacilityListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
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

