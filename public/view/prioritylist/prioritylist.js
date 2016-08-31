'use strict';

angular.module('PGapp.prioritylist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/priorities', {
            templateUrl: 'view/prioritylist/prioritylist.html',
            controller: 'PriorityListCtrl'
        });
    }])

    .controller('PriorityListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
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

