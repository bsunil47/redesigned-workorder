'use strict';

angular.module('PGapp.categorylist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/categories', {
            templateUrl: 'view/categorylist/categorylist.html',
            controller: 'CategoryListCtrl'
        });
    }])

    .controller('CategoryListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
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

