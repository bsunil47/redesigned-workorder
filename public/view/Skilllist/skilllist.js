'use strict';

angular.module('PGapp.skilllist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/skills', {
            templateUrl: 'view/skilllist/skilllist.html',
            controller: 'SkillListCtrl'
        });
    }])

    .controller('SkillListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
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

