'use strict';

angular.module('PGapp.createcategory', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_category', {
            templateUrl: 'view/createcategory/create_category.html',
            controller: 'CreateCategoryCtrl'
        });
    }])

    .controller('CreateCategoryCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {

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