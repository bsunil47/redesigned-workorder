'use strict';

angular.module('PGapp.systemsettings', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/system_settings', {
            templateUrl: 'view/system_settings/systemsettings.html',
            controller: 'SsettingsCtrl'
        });
    }])

    .controller('SsettingsCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                $location.path(reloc);
            } else {
                $location.path("/");
            }
        };
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        }
    }]);